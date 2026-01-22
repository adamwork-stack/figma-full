import {
  Controller,
  Post,
  Body,
  Headers,
  RawBodyRequest,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto, ConfirmPaymentDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiResponse({
    status: 201,
    description: 'Payment intent created successfully',
  })
  createIntent(
    @Body() createDto: CreatePaymentIntentDto,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.createPaymentIntent(createDto, user.id);
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment' })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  confirm(
    @Body() confirmDto: ConfirmPaymentDto,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.confirmPayment(confirmDto, user.id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook handler' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(
      req.rawBody?.toString() || '',
      signature,
    );
  }
}
