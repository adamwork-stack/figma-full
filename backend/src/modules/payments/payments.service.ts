import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentStatus } from '../../database/entities/payment.entity';
import { Order, PaymentStatus as OrderPaymentStatus } from '../../database/entities/order.entity';
import { CreatePaymentIntentDto, ConfirmPaymentDto } from './dto';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  async createPaymentIntent(
    createDto: CreatePaymentIntentDto,
    userId: string,
  ) {
    const { amount, currency, eventId } = createDto;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId,
        eventId,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmPayment(confirmDto: ConfirmPaymentDto, userId: string) {
    const { paymentIntentId, orderId } = confirmDto;

    // Verify payment intent
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
    );

    if (paymentIntent.status !== 'succeeded') {
      throw new NotFoundException('Payment not succeeded');
    }

    // Find order
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    // Create payment record
    const payment = this.paymentRepository.create({
      orderId: order.id,
      userId,
      amount: order.totalAmount,
      currency: order.currency,
      paymentMethod: 'stripe',
      paymentIntentId: paymentIntent.id,
      status: PaymentStatus.SUCCEEDED,
      processedAt: new Date(),
    });

    await this.paymentRepository.save(payment);

    // Update order
    order.paymentStatus = OrderPaymentStatus.SUCCEEDED;
    order.status = 'confirmed' as any;
    await this.orderRepository.save(order);

    return {
      success: true,
      payment,
      order,
    };
  }

  async handleWebhook(payload: string, signature: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret || '',
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Update order status based on payment intent
        await this.orderRepository.update(
          { paymentIntentId: paymentIntent.id },
          {
            paymentStatus: OrderPaymentStatus.SUCCEEDED,
            status: 'confirmed' as any,
          },
        );
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await this.orderRepository.update(
          { paymentIntentId: failedPayment.id },
          {
            paymentStatus: OrderPaymentStatus.FAILED,
          },
        );
        break;
    }

    return { received: true };
  }
}
