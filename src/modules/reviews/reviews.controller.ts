import { Controller, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Get(':accommodationId')
  async getReviewsByAccommodationId(
    @Param('accommodationId') accommodationId: string,
  ) {
    return await this.reviewService.getReviewsByAccommodationId(
      accommodationId,
    );
  }
}
