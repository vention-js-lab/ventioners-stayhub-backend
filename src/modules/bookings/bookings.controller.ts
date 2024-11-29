import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ParseUUIDV4Pipe } from 'src/shared/pipes';
import { CreateBookingReqDto, UpdateBookingStatusReqDto } from './dto/request';
import { AuthTokenGuard } from 'src/shared/guards';
import { GetUser } from 'src/shared/decorators';
import { User } from '../users/entities/user.entity';
import { BookingsQueryParamsReqDto } from './dto/request/bookings-query-params.dto';
import {
  GetMyBookingsSwaggerDecorator,
  GetBookingSwaggerDecorator,
  CreateBookingSwaggerDecorator,
  UpdateBookingStatusSwaggerDecorator,
} from './decorators/swagger.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @GetMyBookingsSwaggerDecorator()
  @Get('')
  @UseGuards(AuthTokenGuard)
  async getMyBookings(
    @Query() queryParams: BookingsQueryParamsReqDto,
    @GetUser() user: User,
  ) {
    const bookings = await this.bookingsService.getMyBookings(
      queryParams,
      user.id,
    );

    return {
      data: bookings,
    };
  }

  @GetBookingSwaggerDecorator()
  @Get(':id')
  @UseGuards(AuthTokenGuard)
  async getBooking(
    @GetUser() user: User,
    @Param('id', new ParseUUIDV4Pipe()) bookingId: string,
  ) {
    const booking = await this.bookingsService.getBooking(user.id, bookingId);

    return {
      data: booking,
    };
  }

  @CreateBookingSwaggerDecorator()
  @Post('')
  @UseGuards(AuthTokenGuard)
  async createBooking(@Body() dto: CreateBookingReqDto, @GetUser() user: User) {
    const newBooking = await this.bookingsService.createBooking(dto, user.id);

    return {
      data: newBooking,
    };
  }

  @UpdateBookingStatusSwaggerDecorator()
  @Patch(':id/status')
  @UseGuards(AuthTokenGuard)
  async updateStatus(
    @Body() dto: UpdateBookingStatusReqDto,
    @Param('id', new ParseUUIDV4Pipe()) bookingId: string,
    @GetUser() user: User,
  ) {
    const updatedBooking = await this.bookingsService.updateStatus(
      dto,
      user.id,
      bookingId,
    );

    return {
      data: updatedBooking,
    };
  }
}
