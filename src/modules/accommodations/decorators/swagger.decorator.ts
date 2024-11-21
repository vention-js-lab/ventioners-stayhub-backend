import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { GetManyAccommodationResponseDto } from '../dto/response';

export function GetAccommodationsSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
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

export function CreateAccommodationSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'User retrieved successfully',
    }),
  );
}

export function GetByIdSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Accommodation found successfully',
    }),
    ApiNotFoundResponse({
      description: 'Accommodation not found',
    }),
  );
}

export function UpdateAccommodationSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Accommodation updated successfully',
    }),
  );
}
export function DeleteAccommodationSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Accommodation deleted successfully',
    }),
    ApiNotFoundResponse({
      description: 'Accommodation not found',
    }),
  );
}
