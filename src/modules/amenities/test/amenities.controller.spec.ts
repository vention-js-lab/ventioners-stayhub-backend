import { Test, TestingModule } from '@nestjs/testing';
import { AmenitiesController } from '../amenities.controller';
import { AmenitiesService } from '../amenities.service';
import { mockAmenities } from './amenities.mock';
import { AmenityDto } from '../dto/response';

describe('AmenitiesController', () => {
  let controller: AmenitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmenitiesController],
      providers: [
        {
          provide: AmenitiesService,
          useValue: {
            getAllAmenities: jest
              .fn<Promise<AmenityDto[]>, []>()
              .mockResolvedValue(mockAmenities),
          },
        },
      ],
    }).compile();

    controller = module.get<AmenitiesController>(AmenitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllAmenities', () => {
    it('returns a list of all amenities', async () => {
      const amenities = await controller.getAllAmenities('en');

      expect(amenities).toEqual({ data: mockAmenities });
    });
  });
});
