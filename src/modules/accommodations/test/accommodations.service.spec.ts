import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationsService } from '../accommodations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Image, Wishlist } from '../entities';
import { Accommodation } from '../entities';
import { AmenitiesService } from 'src/modules/amenities/amenities.service';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { MinioService } from 'src/modules/minio/minio.service';
import { ConfigService } from '@nestjs/config';
import {
  mockWishlistRepo,
  mockAccommodationRepo,
  mockImageRepo,
  mockAmenitiesService,
  mockCategoriesService,
  mockMinioService,
  mockConfigService,
} from './mock/service-dependencies.mock';
import { mockAccommodations } from './mock/accommodations.mock';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateAccommodationDto } from '../dto/request';
import { mockImages } from './mock/images.mock';

describe('AccommodationsService - toggleLikeAccommodation', () => {
  let service: AccommodationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccommodationsService,
        {
          provide: getRepositoryToken(Wishlist),
          useValue: mockWishlistRepo,
        },
        {
          provide: getRepositoryToken(Accommodation),
          useValue: mockAccommodationRepo,
        },
        {
          provide: getRepositoryToken(Image),
          useValue: mockImageRepo,
        },
        {
          provide: AmenitiesService,
          useValue: mockAmenitiesService,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: MinioService,
          useValue: mockMinioService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AccommodationsService>(AccommodationsService);
  });

  describe('toggleWishlistAccommodation', () => {
    const payload = { userId: 'existing-id', accommodationId: 'existing-id' };

    it('unlikes an accommodation if it is already liked', async () => {
      await service.toggleWishlistAccommodation(payload);

      expect(mockWishlistRepo.remove).toHaveBeenCalled();
    });

    it('should like an accommodation if it is not liked', async () => {
      await service.toggleWishlistAccommodation({
        ...payload,
        userId: 'new-id',
      });

      expect(mockWishlistRepo.save).toHaveBeenCalled();
    });
  });

  describe('getAccommodations', () => {
    it('returns a list of accommodations', async () => {
      const result = await service.getAccommodations({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        items: mockAccommodations,
        totalCount: mockAccommodations.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(mockAccommodations.length / 10),
      });
    });
  });

  describe('createAccommodation', () => {
    it("creates an accommodation and return it's details", async () => {
      const result = await service.createAccommodation(
        {
          name: 'Test Accommodation',
          description: 'Test Description',
          location: 'Test Location',
          categoryId: 'existing-id',
          amenities: ['existing-id'],
          pricePerNight: 200,
        },
        'existing-id',
      );

      expect(result).toEqual(mockAccommodations[0]);
    });
  });

  describe('getAccommodationById', () => {
    it("returns an accommodation's details", async () => {
      const result = await service.getAccommodationById('existing-id');

      expect(result).toEqual(mockAccommodations[0]);
    });

    it('throws NotFoundException if accommodation is not found', async () => {
      expect(service.getAccommodationById('non-existing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateAccommodation', () => {
    const updateAccommodationDto: UpdateAccommodationDto = {
      name: 'Test Accommodation',
      description: 'Test Description',
      location: 'Test Location',
      categoryId: 'existing-id',
      amenities: ['existing-id'],
      pricePerNight: 200,
    };

    it("updates an accommodation's details", async () => {
      const result = await service.updateAccommodation(
        'existing-id',
        updateAccommodationDto,
        '3',
      );

      expect(result).toEqual(mockAccommodations[0]);
    });

    it('throws UnauthorizedException if user is not the owner', async () => {
      expect(
        service.updateAccommodation(
          'existing-id',
          updateAccommodationDto,
          'another user',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteAccommodation', () => {
    it('deletes an accommodation', async () => {
      await service.deleteAccommodation('existing-id', '3');

      expect(mockAccommodationRepo.delete).toHaveBeenCalled();
    });

    it('throws UnauthorizedException if user is not the owner', async () => {
      expect(
        service.deleteAccommodation('existing-id', 'another user'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws NotFoundException if accommodation is not found', async () => {
      expect(
        service.deleteAccommodation('non-existing-id', '3'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addImagesToAccommodation', () => {
    it('adds an image to an accommodation', async () => {
      const result = await service.addImagesToAccommodation(
        'existing-id',
        [
          {
            image1: 'test.jpg',
          },
          {
            image2: 'test2.jpg',
          },
        ] as any,
        '3',
      );

      expect(result).toEqual(mockImages);
    });

    it('throws NotFoundException if accommodation is not found', async () => {
      expect(
        service.addImagesToAccommodation(
          'non-existing-id',
          'test.jpg' as any,
          '3',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws UnauthorizedException if user is not the owner', async () => {
      expect(
        service.addImagesToAccommodation(
          'existing-id',
          'test.jpg' as any,
          'another user',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteImage', () => {
    it('deletes an image', async () => {
      await service.deleteImage('existing-id', 'existing-id', '3');

      expect(mockImageRepo.remove).toHaveBeenCalled();
    });

    it('throws NotFoundException if accommodation is not found', async () => {
      expect(
        service.deleteImage('non-existing-id', 'existing-id', '3'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws UnauthorizedException if user is not the owner', async () => {
      expect(
        service.deleteImage('existing-id', 'existing-id', 'another user'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws NotFoundException if image is not found', async () => {
      expect(
        service.deleteImage('existing-id', 'non-existing-id', '3'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
