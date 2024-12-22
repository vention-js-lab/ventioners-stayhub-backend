import { Test, TestingModule } from '@nestjs/testing';
import { mockAmenities } from './amenities.mock';
import { AmenitiesService } from '../amenities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Amenity } from '../entities';
import { RedisService } from 'src/redis/redis.service';

const mockAmenitiesRepository = {
  find: jest.fn().mockResolvedValue(mockAmenities),
};

describe('AmenitiesService', () => {
  let service: AmenitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmenitiesService,
        {
          provide: getRepositoryToken(Amenity),
          useValue: mockAmenitiesRepository,
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn().mockResolvedValue(mockAmenities),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AmenitiesService>(AmenitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllAmenities', () => {
    it('returns a list of all amenities', async () => {
      const amenities = await service.getAllAmenities();

      expect(amenities).toEqual(mockAmenities);
    });
  });
});
