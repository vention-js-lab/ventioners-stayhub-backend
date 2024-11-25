import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { GetManyAccommodationResponseDto } from '../dto/response';
import { AccommodationResponseDto } from '../dto/response/crud-accommodation-response.dto';

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
      description: 'Accommodation created successfully',
      type: AccommodationResponseDto,
    }),
  );
}

export function GetByIdSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Accommodation found successfully',
      type: AccommodationResponseDto,
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
      type: AccommodationResponseDto,
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
