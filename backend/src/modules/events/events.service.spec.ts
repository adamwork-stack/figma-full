import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { Event } from '../../database/entities/event.entity';
import { TicketType } from '../../database/entities/ticket-type.entity';
import { EventImage } from '../../database/entities/event-image.entity';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: Repository<Event>;

  const mockEventRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockTicketTypeRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockEventImageRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
        {
          provide: getRepositoryToken(TicketType),
          useValue: mockTicketTypeRepository,
        },
        {
          provide: getRepositoryToken(EventImage),
          useValue: mockEventImageRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
