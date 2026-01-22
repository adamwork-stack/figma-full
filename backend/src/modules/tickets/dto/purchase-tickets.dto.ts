import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AttendeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: false })
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  phone?: string;
}

class TicketPurchaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ticketTypeId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ type: [AttendeeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDto)
  attendees: AttendeeDto[];
}

export class PurchaseTicketsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ type: [TicketPurchaseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketPurchaseDto)
  tickets: TicketPurchaseDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
