import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ default: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string = 'USD';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventId: string;
}
