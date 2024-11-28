import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationsController } from '../accommodations.controller';
import { AccommodationsService } from '../accommodations.service';
import {
  CreateAccommodationDto,
  SearchAccommodationQueryParamsDto,
  UpdateAccommodationDto,
} from '../dto/request';
import { mockAccommodations } from './mock/accommodations.mock';
import { mockUsers } from 'src/modules/users/test/users.mock';
import { BadRequestException } from '@nestjs/common';
import { mockImages } from './mock/images.mock';
import { mockAccommodationsService } from './mock/controller-dependencies.mock';

describe('AccommodationsController', () => {
  let controller: AccommodationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccommodationsController],
      providers: [
        {
          provide: AccommodationsService,
          useValue: mockAccommodationsService,
        },
      ],
    }).compile();

    controller = module.get<AccommodationsController>(AccommodationsController);
  });

  describe('getAccommodations', () => {
    it('returns paginated list of accommodations', async () => {
      const searchParams: SearchAccommodationQueryParamsDto = {
        page: 1,
        limit: 10,
      };

      const result = await controller.getAccommodations(searchParams);

      expect(result).toEqual({
        data: mockAccommodations,
        totalCount: mockAccommodations.length,
        totalPages: Math.ceil(mockAccommodations.length / 10),
        page: 1,
        limit: 10,
      });
    });
  });

  describe('createAccommodation', () => {
    const createAccommodationDto: CreateAccommodationDto = {
      name: 'Test Accommodation',
      description: 'Test Description',
      location: 'Test Location',
      categoryId: 'test-category-id',
      amenities: ['test-amenity-id'],
      pricePerNight: 100,
    };

    it('throws an error if no image is provided', () => {
      expect(
        controller.createAccommodation(
          createAccommodationDto,
          mockUsers[0],
          [],
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it("creates a new accommodation and returns it's data", async () => {
      const result = await controller.createAccommodation(
        createAccommodationDto,
        mockUsers[0],
        [{ filename: 'test.jpg' }] as any,
      );

      expect(result).toEqual({ data: mockAccommodations[0] });
    });
  });

  describe('getAccommodationById', () => {
    it("returns an accommodation's data by id", async () => {
      const result = await controller.getAccommodationById('1');

      expect(result).toEqual({ data: mockAccommodations[0] });
    });
  });

  describe('updateAccommodation', () => {
    const updateAccommodationDto: UpdateAccommodationDto = {
      name: 'Updated Accommodation',
      description: 'Updated Description',
      location: 'Updated Location',
      categoryId: 'updated-category-id',
      amenities: ['updated-amenity-id'],
      pricePerNight: 200,
    };

    it("updates an accommodation's data", async () => {
      const result = await controller.updateAccommodation(
        '1',
        updateAccommodationDto,
        mockUsers[0],
      );

      expect(result).toEqual({ data: mockAccommodations[0] });
    });
  });

  describe('deleteAccommodation', () => {
    it('deletes an accommodation by id', async () => {
      expect(
        controller.deleteAccommodation('1', mockUsers[0]),
      ).resolves.not.toThrow();
    });
  });

  describe('toggleWishlistAccommodation', () => {
    it('toggles an accommodation in user wishlist', async () => {
      expect(
        controller.toggleWishlistAccommodation('1', mockUsers[0]),
      ).resolves.not.toThrow();
    });
  });

  describe('addImages', () => {
    it('adds images to an accommodation', async () => {
      const result = await controller.addImages(
        '1',
        [{ filename: 'test.jpg' }] as any,
        mockUsers[0],
      );

      expect(result).toEqual({ data: mockImages });
    });
  });

  describe('deleteImage', () => {
    it('deletes an image by id', async () => {
      expect(
        controller.deleteImage('1', '2', mockUsers[0]),
      ).resolves.not.toThrow();
    });
  });
});
