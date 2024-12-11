import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from '../reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from '../entities';
import { Accommodation } from 'src/modules/accommodations';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockReviewRepository = { find: jest.fn() };
  const mockAccommodationRepository = { find: jest.fn() };
  const mockUserRepository = { findOne: jest.fn() };

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
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
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
