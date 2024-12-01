import { Image } from '../../entities';
import { mockAccommodations } from './accommodations.mock';
import { AccommodationDto } from '../../dto';
import { PaginatedResult } from '../../interfaces';
import {
  CreateAccommodationDto,
  SearchAccommodationQueryParamsDto,
  UpdateAccommodationDto,
  WishlistAccommodationDto,
} from '../../dto/request';
import { mockImages } from './images.mock';

const mockPaginatedResult: PaginatedResult<AccommodationDto> = {
  items: mockAccommodations,
  totalCount: mockAccommodations.length,
  totalPages: Math.ceil(mockAccommodations.length / 10),
  page: 1,
  limit: 10,
};

export const mockAccommodationsService = {
  getAccommodations: jest
    .fn<
      Promise<PaginatedResult<AccommodationDto>>,
      [SearchAccommodationQueryParamsDto]
    >()
    .mockImplementation((searchParams) =>
      Promise.resolve({
        ...mockPaginatedResult,
        page: searchParams.page,
        limit: searchParams.limit,
      }),
    ),
  createAccommodation: jest
    .fn<Promise<AccommodationDto>, [CreateAccommodationDto, string]>()
    .mockResolvedValue(mockAccommodations[0]),
  getAccommodationById: jest
    .fn<Promise<AccommodationDto>, [string]>()
    .mockResolvedValue(mockAccommodations[0]),
  updateAccommodation: jest
    .fn<Promise<AccommodationDto>, [string, UpdateAccommodationDto, string]>()
    .mockResolvedValue(mockAccommodations[0]),
  deleteAccommodation: jest.fn(),
  toggleWishlistAccommodation: jest
    .fn<Promise<void>, [WishlistAccommodationDto]>()
    .mockResolvedValue(undefined),
  addImagesToAccommodation: jest
    .fn<Promise<Image[]>, [string, any, string]>()
    .mockResolvedValue(mockImages),
  deleteImage: jest.fn(),
};
