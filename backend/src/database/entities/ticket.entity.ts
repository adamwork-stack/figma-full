import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';
import { TicketType } from './ticket-type.entity';
import { TicketAttendee } from './ticket-attendee.entity';

export enum TicketStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'event_id' })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.tickets)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'ticket_type_id' })
  ticketTypeId: string;

  @ManyToOne(() => TicketType, (ticketType) => ticketType.tickets)
  @JoinColumn({ name: 'ticket_type_id' })
  ticketType: TicketType;

  @Column()
  orderId: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  currency: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status: TicketStatus;

  @Column({ name: 'qr_code', nullable: true })
  qrCode: string;

  @Column({ name: 'checked_in', default: false })
  checkedIn: boolean;

  @Column({ name: 'checked_in_at', type: 'timestamp', nullable: true })
  checkedInAt: Date;

  @Column({ name: 'purchased_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchasedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => TicketAttendee, (attendee) => attendee.ticket)
  attendees: TicketAttendee[];
}
