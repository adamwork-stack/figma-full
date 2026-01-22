import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../../database/entities/ticket.entity';
import { TicketType } from '../../database/entities/ticket-type.entity';
import { TicketAttendee } from '../../database/entities/ticket-attendee.entity';
import { Order } from '../../database/entities/order.entity';
import { Event } from '../../database/entities/event.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      TicketType,
      TicketAttendee,
      Order,
      Event,
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
