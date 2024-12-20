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
import { readFileSync } from 'fs';

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

    jest.mock('blurhash', () => ({
      encode: jest.fn().mockReturnValue('test-hash'),
    }));

    jest.mock('sharp', () => {
      return jest.fn(() => ({
        clone: jest.fn().mockReturnThis(),
        resize: jest.fn().mockReturnThis(),
        jpeg: jest.fn().mockReturnThis(),
        ensureAlpha: jest.fn().mockReturnThis(),
        raw: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('test image data')),
      }));
    });
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
        items: mockAccommodations.map((accommodation) => ({
          ...accommodation,
          overallRating: 0,
        })),
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
          locationCoordinates: {
            type: 'Poitn',
            coordinates: [0, 0],
          },
          numberOfGuests: 4,
        },
        'existing-id',
      );

      expect(result).toEqual(mockAccommodations[0]);
    });
  });

  describe('getAccommodationById', () => {
    it("returns an accommodation's details", async () => {
      const result = await service.getAccommodationById('existing-id');

      expect(result).toEqual({ ...mockAccommodations[0], overallRating: 0 });
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
    const mockBuffer = readFileSync(
      'src/modules/accommodations/test/mock/example.jpg',
    );

    const mockFiles = [
      {
        buffer: mockBuffer,
        mimetype: 'image/png',
        originalname: 'test.png',
        size: mockBuffer.length,
      },
      {
        buffer: mockBuffer,
        mimetype: 'image/png',
        originalname: 'test.png',
        size: mockBuffer.length,
      },
    ] as any;

    it('adds an image to an accommodation', async () => {
      const result = await service.addImagesToAccommodation(
        'existing-id',
        mockFiles,
        '3',
      );

      expect(result).toEqual(mockImages);
    });

    it('throws NotFoundException if accommodation is not found', async () => {
      expect(
        service.addImagesToAccommodation('non-existing-id', mockFiles, '3'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws UnauthorizedException if user is not the owner', async () => {
      expect(
        service.addImagesToAccommodation(
          'existing-id',
          mockFiles,
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
