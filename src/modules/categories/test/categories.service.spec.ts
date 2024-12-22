import { Test, TestingModule } from '@nestjs/testing';
import { mockCategories } from './categories.mock';
import { CategoriesService } from '../categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccommodationCategory } from '../entities';
import { RedisService } from 'src/redis/redis.service';

const mockCategoriesRepository = {
  find: jest.fn().mockResolvedValue(mockCategories),
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(AccommodationCategory),
          useValue: mockCategoriesRepository,
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn().mockResolvedValue(mockCategories),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('returns a list of categories', async () => {
      const categories = await service.getAllCategories();

      expect(categories).toEqual(mockCategories);
    });
  });
});
