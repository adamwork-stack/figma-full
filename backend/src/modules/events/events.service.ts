import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual } from 'typeorm';
import { Event, EventStatus } from '../../database/entities/event.entity';
import { TicketType } from '../../database/entities/ticket-type.entity';
import { EventImage } from '../../database/entities/event-image.entity';
import { CreateEventDto, UpdateEventDto, QueryEventsDto } from './dto';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(TicketType)
    private ticketTypeRepository: Repository<TicketType>,
    @InjectRepository(EventImage)
    private eventImageRepository: Repository<EventImage>,
  ) {}

  async create(createEventDto: CreateEventDto, organizerId: string) {
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      location,
      ticketTypes,
      terms,
      status,
    } = createEventDto;

    // Create event
    const event = this.eventRepository.create({
      organizerId,
      title,
      description,
      category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      locationName: location.name,
      locationAddress: location.address,
      locationCity: location.city,
      locationCountry: location.country,
      locationLatitude: location.latitude,
      locationLongitude: location.longitude,
      terms,
      status: status || EventStatus.DRAFT,
    });

    const savedEvent = await this.eventRepository.save(event);

    // Create ticket types
    const createdTicketTypes = await Promise.all(
      ticketTypes.map(ticketType =>
        this.ticketTypeRepository.save({
          eventId: savedEvent.id,
          name: ticketType.name,
          description: ticketType.description,
          price: ticketType.price,
          quantityTotal: ticketType.available,
          saleStartDate: ticketType.saleStartDate
            ? new Date(ticketType.saleStartDate)
            : null,
          saleEndDate: ticketType.saleEndDate
            ? new Date(ticketType.saleEndDate)
            : null,
        }),
      ),
    );

    return {
      ...savedEvent,
      ticketTypes: createdTicketTypes,
    };
  }

  async findAll(queryDto: QueryEventsDto) {
    const {
      page = 1,
      limit = 20,
      category,
      location,
      dateFrom,
      dateTo,
      search,
    } = queryDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.ticketTypes', 'ticketTypes')
      .where('event.status = :status', { status: EventStatus.PUBLISHED })
      .andWhere('event.endDate >= :now', { now: new Date() });

    if (category) {
      queryBuilder.andWhere('event.category = :category', { category });
    }

    if (location) {
      queryBuilder.andWhere(
        '(event.locationCity LIKE :location OR event.locationCountry LIKE :location)',
        { location: `%${location}%` },
      );
    }

    if (dateFrom) {
      queryBuilder.andWhere('event.startDate >= :dateFrom', {
        dateFrom: new Date(dateFrom),
      });
    }

    if (dateTo) {
      queryBuilder.andWhere('event.endDate <= :dateTo', {
        dateTo: new Date(dateTo),
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(event.title LIKE :search OR event.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('event.startDate', 'ASC')
      .skip(skip)
      .take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    // Calculate ticket counts for each event
    const eventsWithCounts = await Promise.all(
      events.map(async event => {
        const ticketTypes = await this.ticketTypeRepository.find({
          where: { eventId: event.id, isActive: true },
        });

        const totalTickets = ticketTypes.reduce(
          (sum, tt) => sum + tt.quantityTotal,
          0,
        );
        const soldTickets = ticketTypes.reduce(
          (sum, tt) => sum + tt.quantitySold,
          0,
        );

        return {
          ...event,
          ticketCount: {
            total: totalTickets,
            available: totalTickets - soldTickets,
            sold: soldTickets,
          },
          price: {
            min: Math.min(...ticketTypes.map(tt => Number(tt.price))),
            max: Math.max(...ticketTypes.map(tt => Number(tt.price))),
            currency: ticketTypes[0]?.currency || 'USD',
          },
        };
      }),
    );

    return {
      data: eventsWithCounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'ticketTypes', 'images'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const ticketTypes = await this.ticketTypeRepository.find({
      where: { eventId: event.id, isActive: true },
    });

    const totalTickets = ticketTypes.reduce(
      (sum, tt) => sum + tt.quantityTotal,
      0,
    );
    const soldTickets = ticketTypes.reduce(
      (sum, tt) => sum + tt.quantitySold,
      0,
    );

    return {
      ...event,
      ticketCount: {
        total: totalTickets,
        available: totalTickets - soldTickets,
        sold: soldTickets,
      },
      price: {
        min: Math.min(...ticketTypes.map(tt => Number(tt.price))),
        max: Math.max(...ticketTypes.map(tt => Number(tt.price))),
        currency: ticketTypes[0]?.currency || 'USD',
      },
    };
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async remove(id: string, userId: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.eventRepository.remove(event);
    return { message: 'Event deleted successfully' };
  }
}
