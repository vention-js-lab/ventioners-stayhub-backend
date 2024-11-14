import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { GetManyAccommodationResponseDto } from '../dto/response';

export function GetAccommodationsSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Accommodations retrieved successfully',
      type: GetManyAccommodationResponseDto,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'category',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'location',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'fromDate',
      required: false,
      type: Date,
    }),
    ApiQuery({
      name: 'toDate',
      required: false,
      type: Date,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
    }),
  );
}
