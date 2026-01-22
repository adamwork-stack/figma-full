import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
