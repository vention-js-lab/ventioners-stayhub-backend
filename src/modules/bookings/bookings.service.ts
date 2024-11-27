import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingReqDto, UpdateBookingStatusReqDto } from './dto/request';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsQueryParamsReqDto } from './dto/request/bookings-query-params.dto';
import { Accommodation } from '../accommodations';
import { BookingStatus } from './constants/booking-status.constant';
import { BOOKING_SERVICE_FEE } from './constants/booking-service-fee.constant';
import { BookingStatusTransitions } from './constants/bookings-status-transition.constant';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>, // TODO: will replace with service once Akilbek's pr is merged
  ) {}

  async getMyBookings(
    queryParamsDto: BookingsQueryParamsReqDto,
    userId: string,
  ) {
    const queryBuilder = this.bookingRepository.createQueryBuilder('booking');

    queryBuilder.where('booking.userId = :userId', { userId });

    if (queryParamsDto.status) {
      queryBuilder.andWhere('booking.status = :status', {
        status: queryParamsDto.status,
      });
    }

    queryBuilder
      .leftJoinAndSelect('booking.accommodation', 'accommodation')
      .select(['booking', 'accommodation']);

    return await queryBuilder.getMany();
  }

  async getBooking(userId: string, bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['accommodation', 'user'],
    });

    // TODO: will uncomment this after Akilbek's pr is merged and accommodation has ownner field
    //
    // if (booking.accommodation.ownerId !== userId) {
    //     throw new UnauthorizedException('You are not allowed to update this booking');
    // }

    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    return booking;
  }

  async createBooking(
    dto: CreateBookingReqDto,
    userId: string,
  ): Promise<Booking> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id: dto.accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundException(
        `Accommodation with id ${dto.accommodationId} not found`,
      );
    }

    if (dto.checkOutDate <= dto.checkInDate) {
      throw new BadRequestException('Check out date should be after check in');
    }

    if (dto.checkInDate <= new Date()) {
      throw new BadRequestException("Check in date can't be in the past");
    }

    const existingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.accommodationId = :accommodationId', {
        accommodationId: dto.accommodationId,
      })
      .andWhere(
        `booking.checkInDate <= :checkInDate AND booking.checkOutDate >= :checkInDate OR 
         booking.checkInDate <= :checkOutDate AND booking.checkOutDate >= :checkOutDate OR
         booking.checkInDate >= :checkInDate AND booking.checkOutDate <= :checkOutDate`,
        { checkInDate: dto.checkInDate, checkOutDate: dto.checkOutDate },
      )
      .andWhere('booking.status IN (:...activeStatuses)', {
        activeStatuses: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
      })
      .getCount();

    if (existingBookings > 0) {
      throw new BadRequestException(
        'Accommodation is already booked for the selected dates',
      );
    }

    const nights = this.calculateNights(dto.checkInDate, dto.checkOutDate);

    const newBooking = this.bookingRepository.create({
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      numberOfGuests: dto.numberOfGuests,
      accommodation: {
        id: dto.accommodationId,
      },
      user: {
        id: userId,
      },
      totalPrice: this.calculateTotalPrice(accommodation.pricePerNight, nights),
    });

    return await this.bookingRepository.save(newBooking);
  }

  async updateStatus(
    dto: UpdateBookingStatusReqDto,
    userId: string,
    bookingId: string,
  ) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    // TODO: will uncomment this after Akilbek's pr is merged and accommodation has ownner field
    //
    // if (booking.accommodation.ownerId !== userId) {
    //     throw new UnauthorizedException('You are not allowed to update this booking');
    // }

    const allowedStatusTransitions = BookingStatusTransitions[booking.status];

    if (!allowedStatusTransitions.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${booking.status} to status ${dto.status}`,
      );
    }

    booking.status = dto.status;

    return await this.bookingRepository.save(booking);
  }

  private calculateNights(checkInDate: Date, checkOutDate: Date): number {
    const normalizedCheckInDate = this.truncateTime(checkInDate);
    const normalizedCheckOutDate = this.truncateTime(checkOutDate);

    const diffInMilliseconds =
      normalizedCheckOutDate.getTime() - normalizedCheckInDate.getTime();

    const nights = diffInMilliseconds / (1000 * 60 * 60 * 24);

    return Math.max(nights, 1);
  }

  private calculateTotalPrice(pricePerNight: number, nights: number): number {
    const basePrice = nights * pricePerNight;

    return basePrice + basePrice * BOOKING_SERVICE_FEE;
  }

  private truncateTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
