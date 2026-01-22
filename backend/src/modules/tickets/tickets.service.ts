import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Ticket, TicketStatus } from '../../database/entities/ticket.entity';
import { TicketType } from '../../database/entities/ticket-type.entity';
import { TicketAttendee } from '../../database/entities/ticket-attendee.entity';
import { Order, OrderStatus, PaymentStatus } from '../../database/entities/order.entity';
import { Event } from '../../database/entities/event.entity';
import { PurchaseTicketsDto } from './dto';
import * as QRCode from 'qrcode';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketType)
    private ticketTypeRepository: Repository<TicketType>,
    @InjectRepository(TicketAttendee)
    private attendeeRepository: Repository<TicketAttendee>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private dataSource: DataSource,
  ) {}

  async findAll(userId: string) {
    return this.ticketRepository.find({
      where: { userId },
      relations: ['event', 'ticketType'],
      order: { purchasedAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['event', 'ticketType', 'attendees'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.userId !== userId) {
      throw new ForbiddenException('You can only view your own tickets');
    }

    return ticket;
  }

  async purchase(purchaseDto: PurchaseTicketsDto, userId: string) {
    const { eventId, tickets, paymentMethodId } = purchaseDto;

    // Verify event exists
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Use transaction to ensure data consistency
    return await this.dataSource.transaction(async (manager) => {
      const ticketRepo = manager.getRepository(Ticket);
      const ticketTypeRepo = manager.getRepository(TicketType);
      const attendeeRepo = manager.getRepository(TicketAttendee);
      const orderRepo = manager.getRepository(Order);

      // Calculate total and verify availability
      let totalAmount = 0;
      const ticketTypesToUpdate: TicketType[] = [];

      for (const ticketPurchase of tickets) {
        const ticketType = await ticketTypeRepo.findOne({
          where: { id: ticketPurchase.ticketTypeId, eventId },
        });

        if (!ticketType) {
          throw new NotFoundException(
            `Ticket type ${ticketPurchase.ticketTypeId} not found`,
          );
        }

        if (!ticketType.isActive) {
          throw new BadRequestException(
            `Ticket type ${ticketType.name} is not available`,
          );
        }

        const available = ticketType.quantityTotal - ticketType.quantitySold;
        if (available < ticketPurchase.quantity) {
          throw new BadRequestException(
            `Not enough tickets available for ${ticketType.name}`,
          );
        }

        totalAmount += Number(ticketType.price) * ticketPurchase.quantity;
        ticketTypesToUpdate.push(ticketType);
      }

      // Create order
      const order = orderRepo.create({
        userId,
        totalAmount,
        currency: 'USD',
        paymentIntentId: paymentMethodId,
        paymentStatus: PaymentStatus.PENDING,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await orderRepo.save(order);

      // Create tickets and attendees
      const createdTickets: Ticket[] = [];

      for (let i = 0; i < tickets.length; i++) {
        const ticketPurchase = tickets[i];
        const ticketType = ticketTypesToUpdate[i];

        // Update ticket type availability
        ticketType.quantitySold += ticketPurchase.quantity;
        await ticketTypeRepo.save(ticketType);

        // Create tickets
        for (let j = 0; j < ticketPurchase.quantity; j++) {
          const attendee = ticketPurchase.attendees[j] || {
            firstName: '',
            lastName: '',
          };

          const ticket = ticketRepo.create({
            userId,
            eventId,
            ticketTypeId: ticketType.id,
            orderId: savedOrder.id,
            quantity: 1,
            unitPrice: Number(ticketType.price),
            totalPrice: Number(ticketType.price),
            currency: ticketType.currency,
            status: TicketStatus.PENDING,
          });

          const savedTicket = await ticketRepo.save(ticket);

          // Create attendee
          const savedAttendee = await attendeeRepo.save({
            ticketId: savedTicket.id,
            firstName: attendee.firstName,
            lastName: attendee.lastName,
            email: attendee.email,
            phone: attendee.phone,
          });

          // Generate QR code
          const qrData = JSON.stringify({
            ticketId: savedTicket.id,
            eventId: event.id,
            orderId: savedOrder.id,
          });

          const qrCode = await QRCode.toDataURL(qrData);
          savedTicket.qrCode = qrCode;
          await ticketRepo.save(savedTicket);

          createdTickets.push(savedTicket);
        }
      }

      return {
        orderId: savedOrder.id,
        tickets: createdTickets,
        totalAmount,
        currency: 'USD',
        status: OrderStatus.PENDING,
      };
    });
  }

  async confirmPurchase(orderId: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['tickets'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only confirm your own orders');
    }

    // Update order status
    order.status = OrderStatus.CONFIRMED;
    order.paymentStatus = PaymentStatus.SUCCEEDED;
    await this.orderRepository.save(order);

    // Update ticket statuses
    await this.ticketRepository.update(
      { orderId },
      { status: TicketStatus.CONFIRMED },
    );

    return order;
  }
}
