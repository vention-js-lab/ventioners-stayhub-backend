import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookingReqDto, UpdateBookingStatusReqDto } from './dto/request';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsQueryParamsReqDto } from './dto/request/bookings-query-params.dto';
import {
  BookingStatus,
  BookingStatusTransitions,
  BOOKING_SERVICE_FEE,
} from './constants';
import { AccommodationsService } from '../accommodations/accommodations.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @Inject(AccommodationsService)
    private readonly accommodationsService: AccommodationsService,
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
      relations: ['accommodation', 'user', 'accommodation.owner'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    if (
      booking.accommodation.owner.id !== userId &&
      booking.user.id !== userId
    ) {
      throw new UnauthorizedException(
        'You are not allowed to view this booking',
      );
    }

    return booking;
  }

  async createBooking(
    dto: CreateBookingReqDto,
    userId: string,
  ): Promise<Booking> {
    const accommodation = await this.accommodationsService.getAccommodationById(
      dto.accommodationId,
    );

    if (!accommodation) {
      throw new NotFoundException(
        `Accommodation with id ${dto.accommodationId} not found`,
      );
    }

    if (accommodation.owner.id === userId) {
      throw new BadRequestException("You can't book your own accommodation");
    }

    const existingBookings = await this.getExistingBookings(
      accommodation.id,
      dto.checkInDate,
      dto.checkOutDate,
    );

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
      relations: ['accommodation', 'accommodation.owner'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    if (booking.accommodation.owner.id !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this booking',
      );
    }

    const allowedStatusTransitions = BookingStatusTransitions[booking.status];

    if (!allowedStatusTransitions.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${booking.status} to status ${dto.status}`,
      );
    }

    booking.status = dto.status;

    return await this.bookingRepository.save(booking);
  }

  async getExistingBookings(
    accommodationId: string,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<number> {
    return await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.accommodationId = :accommodationId', {
        accommodationId: accommodationId,
      })
      .andWhere(
        `booking.checkInDate <= :checkInDate AND booking.checkOutDate >= :checkInDate OR 
         booking.checkInDate <= :checkOutDate AND booking.checkOutDate >= :checkOutDate OR
         booking.checkInDate >= :checkInDate AND booking.checkOutDate <= :checkOutDate`,
        { checkInDate: checkInDate, checkOutDate: checkOutDate },
      )
      .andWhere('booking.status IN (:...activeStatuses)', {
        activeStatuses: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
      })
      .getCount();
  }

  private calculateNights(checkInDate: Date, checkOutDate: Date): number {
    const diffInMilliseconds = checkInDate.getTime() - checkOutDate.getTime();

    const nights = diffInMilliseconds / (1000 * 60 * 60 * 24);

    return Math.max(nights, 1);
  }

  private calculateTotalPrice(pricePerNight: number, nights: number): number {
    const basePrice = nights * pricePerNight;

    return basePrice + basePrice * BOOKING_SERVICE_FEE;
  }
}
