import { Test, TestingModule } from '@nestjs/testing';
import { mockAmenities } from './amenities.mock';
import { AmenitiesService } from '../amenities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Amenity } from '../entities';

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
