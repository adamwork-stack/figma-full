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
import { Event } from './event.entity';
import { Ticket } from './ticket.entity';

@Entity('ticket_types')
export class TicketType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id' })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.ticketTypes)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ name: 'quantity_total' })
  quantityTotal: number;

  @Column({ name: 'quantity_sold', default: 0 })
  quantitySold: number;

  @Column({ name: 'sale_start_date', type: 'timestamp', nullable: true })
  saleStartDate: Date;

  @Column({ name: 'sale_end_date', type: 'timestamp', nullable: true })
  saleEndDate: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Ticket, (ticket) => ticket.ticketType)
  tickets: Ticket[];
}
