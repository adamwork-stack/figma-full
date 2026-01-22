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
import { TicketType } from './ticket-type.entity';
import { Ticket } from './ticket.entity';
import { EventImage } from './event-image.entity';

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organizer_id' })
  organizerId: string;

  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({ name: 'organizer_id' })
  organizer: User;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({ name: 'location_name' })
  locationName: string;

  @Column({ name: 'location_address' })
  locationAddress: string;

  @Column({ name: 'location_city' })
  locationCity: string;

  @Column({ name: 'location_country' })
  locationCountry: string;

  @Column({ name: 'location_latitude', type: 'decimal', nullable: true })
  locationLatitude: number;

  @Column({ name: 'location_longitude', type: 'decimal', nullable: true })
  locationLongitude: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column('text', { nullable: true })
  terms: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => TicketType, (ticketType) => ticketType.event)
  ticketTypes: TicketType[];

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];

  @OneToMany(() => EventImage, (image) => image.event)
  images: EventImage[];
}
