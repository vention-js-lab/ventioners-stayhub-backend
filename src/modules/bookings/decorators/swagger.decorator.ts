import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  CreateBookingDto,
  GetBookingDto,
  GetMyBookingsDto,
  UpdateBookingStatusDto,
} from '../dto/response';

export function GetMyBookingsSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'My bookings retrieved successfully',
      type: GetMyBookingsDto,
    }),
  );
}

export function GetBookingSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Booking retrieved successfully',
      type: GetBookingDto,
    }),
    ApiNotFoundResponse({
      description: 'Booking not found',
    }),
  );
}

export function CreateBookingSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Booking created successfully',
      type: CreateBookingDto,
    }),
    ApiNotFoundResponse({
      description: 'Accommodation not found',
    }),
    ApiBadRequestResponse({
      description: 'Invalid booking dates',
    }),
  );
}

export function UpdateBookingStatusSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Booking status updated successfully',
      type: UpdateBookingStatusDto,
    }),
    ApiNotFoundResponse({
      description: 'Booking not found',
    }),
    ApiBadRequestResponse({
      description: 'Invalid booking status transition',
    }),
  );
}
