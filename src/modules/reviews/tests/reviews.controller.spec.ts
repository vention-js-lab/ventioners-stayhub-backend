import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from '../reviews.controller';
import { ReviewsService } from '../reviews.service';
import { NotFoundException } from '@nestjs/common';

describe('ReviewsController', () => {
  let controller: ReviewsController;

  const mockReviewsService = {
    getReviewsByAccommodationId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [{ provide: ReviewsService, useValue: mockReviewsService }],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should return reviews for valid accommodation id', async () => {
    const accommodationId = 'valid-id';
    const mockReviews = [{ id: 'review-id' }];
    mockReviewsService.getReviewsByAccommodationId.mockResolvedValue(
      mockReviews,
    );

    const result =
      await controller.getReviewsByAccommodationId(accommodationId);
    expect(result).toEqual(mockReviews);
  });

  it('should throw NotFoundException for invalid accommodation id', async () => {
    const accommodationId = 'invalid-id';
    mockReviewsService.getReviewsByAccommodationId.mockRejectedValue(
      new NotFoundException(),
    );

    await expect(
      controller.getReviewsByAccommodationId(accommodationId),
    ).rejects.toThrow(NotFoundException);
  });
});
