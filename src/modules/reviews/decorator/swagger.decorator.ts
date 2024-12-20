import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ReviewResponseDto } from '../dto/response/review.dto';

export function CreateReviewSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Review created successfully',
      type: ReviewResponseDto,
    }),
  );
}
