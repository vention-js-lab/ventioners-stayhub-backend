import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from '../reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from '../entities';
import { Accommodation } from 'src/modules/accommodations';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { AccommodationsService } from 'src/modules/accommodations/accommodations.service';
import { BookingsService } from 'src/modules/bookings/bookings.service';

describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockReviewRepository = { find: jest.fn() };
  const mockAccommodationRepository = { find: jest.fn() };
  const mockBookingService = { getMyBookings: jest.fn() };
  const mockUsersService = { findUserById: jest.fn() };
  const mockAccommodationService = { findAccommodationById: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: getRepositoryToken(Review), useValue: mockReviewRepository },
        {
          provide: getRepositoryToken(Accommodation),
          useValue: mockAccommodationRepository,
        },
        {
          provide: BookingsService,
          useValue: mockBookingService,
        },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AccommodationsService, useValue: mockAccommodationService },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should return reviews for valid accommodation id', async () => {
    const accommodationId = 'valid-id';
    mockAccommodationRepository.find.mockResolvedValueOnce([
      { id: accommodationId },
    ]);
    mockReviewRepository.find.mockResolvedValueOnce([{ id: 'review-id' }]);

    const result = await service.getReviewsByAccommodationId(accommodationId);
    expect(result).toEqual([{ id: 'review-id' }]);
  });

  it('should throw NotFoundException for invalid accommodation id', async () => {
    const accommodationId = 'invalid-id';
    mockAccommodationRepository.find.mockResolvedValueOnce([]);

    await expect(
      service.getReviewsByAccommodationId(accommodationId),
    ).rejects.toThrow(NotFoundException);
  });
});
