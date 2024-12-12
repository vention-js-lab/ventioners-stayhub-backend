import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/request/creare-review.dto';
import { GetUser } from 'src/shared/decorators';
import { AuthTokenGuard } from 'src/shared/guards';
import { User } from '../users/entities/user.entity';
import { CreateReviewSwaggerDecorator } from './decorator/swagger.decorator';

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

  @Post('')
  @CreateReviewSwaggerDecorator()
  @UseGuards(AuthTokenGuard)
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() payload: User,
  ) {
    return await this.reviewService.createReview(createReviewDto, payload.id);
  }
}
