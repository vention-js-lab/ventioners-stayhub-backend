import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/request/creare-review.dto';
import { ParseUUIDV4Pipe } from 'src/shared/pipes';
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

  @Post(':accommodationId')
  @CreateReviewSwaggerDecorator()
  @UseGuards(AuthTokenGuard)
  async createReview(
    @Param('accommodationId', new ParseUUIDV4Pipe()) accommodationId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() payload: User,
  ) {
    return await this.reviewService.createReview(
      accommodationId,
      createReviewDto,
      payload.id,
    );
  }
}
