import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { Accommodation, Image, Wishlist } from '../../entities';
import { User } from 'src/modules/users/entities/user.entity';
import { AmenitiesService } from 'src/modules/amenities/amenities.service';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { MinioService } from 'src/modules/minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { mockAccommodations } from './accommodations.mock';
import { mockWishlist } from './wishlist.mock';
import { mockImages } from './images.mock';
import { mockCategories } from 'src/modules/categories/test/categories.mock';
import { mockAmenities } from 'src/modules/amenities/test/amenities.mock';

export const mockWishlistRepo: Partial<Repository<Wishlist>> = {
  findOne: jest
    .fn()
    .mockImplementation((options: { where: FindOptionsWhere<Wishlist> }) => {
      const user = options.where.user as User;
      const accommodation = options.where.accommodation as Accommodation;

      if (user.id === 'existing-id' && accommodation.id === 'existing-id') {
        return Promise.resolve(mockWishlist);
      }

      return Promise.resolve(null);
    }),
  save: jest.fn().mockResolvedValue(mockWishlist),
  remove: jest.fn(),
  create: jest.fn().mockReturnValue(mockWishlist),
};

export const mockAccommodationRepo: Partial<Repository<Accommodation>> = {
  findOne: jest
    .fn()
    .mockImplementation(
      (options: { where: FindOptionsWhere<Accommodation> }) => {
        const id = options.where.id;

        if (id === 'existing-id') {
          return Promise.resolve(mockAccommodations[0]);
        }

        return Promise.resolve(null);
      },
    ),
  save: jest.fn().mockResolvedValue(mockAccommodations[0]),
  create: jest.fn().mockReturnValue(mockAccommodations[0]),
  delete: jest
    .fn<Promise<DeleteResult>, [string]>()
    .mockImplementation((id: string) => {
      if (id === 'existing-id') {
        return Promise.resolve({ affected: 1, raw: '' });
      }

      return Promise.resolve({ affected: 0, raw: '' });
    }),
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(mockAccommodations.length),
    getMany: jest.fn().mockResolvedValue(mockAccommodations),
  }),
};

export const mockImageRepo: Partial<Repository<Image>> = {
  findOneBy: jest.fn().mockImplementation(({ id }) => {
    if (id === 'existing-id') {
      return Promise.resolve(mockImages[0]);
    }

    return Promise.resolve(null);
  }),
  save: jest.fn().mockResolvedValue(mockImages),
  create: jest
    .fn()
    .mockReturnValueOnce(mockImages[0])
    .mockReturnValueOnce(mockImages[1]),
  remove: jest.fn(),
  delete: jest.fn(),
};

export const mockAmenitiesService: Partial<AmenitiesService> = {
  getAmenitiesByIds: jest.fn().mockResolvedValue(mockAmenities),
};
export const mockCategoriesService: Partial<CategoriesService> = {
  getCategoryById: jest.fn().mockResolvedValue(mockCategories[0]),
};
export const mockMinioService: Partial<MinioService> = {
  uploadFile: jest.fn().mockResolvedValue('image.jpg'),
  deleteFile: jest.fn(),
};
export const mockConfigService: Partial<ConfigService> = {
  get: jest.fn().mockReturnValue('ENV_VALUE'),
};
