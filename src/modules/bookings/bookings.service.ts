import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  BookingsQueryParamsReqDto,
  CreateBookingReqDto,
  UpdateBookingStatusReqDto,
} from './dto/request';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import {
  BOOKING_SERVICE_FEE,
  BookingStatus,
  BookingStatusTransitions,
} from './constants';
import { AccommodationsService } from '../accommodations/accommodations.service';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @Inject(AccommodationsService)
    private readonly accommodationsService: AccommodationsService,
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  private readonly logger = new Logger(BookingsService.name);

  async updateBookingStatusToCheckedOut() {
    const truncatedToday = this.truncateDateToYearMonthDay(new Date());

    this.logger.log(
      `Starting updateBookingStatusToCheckedOut for date: ${truncatedToday.toISOString()}`,
    );

    const result = await this.bookingRepository.update(
      {
        status: BookingStatus.CHECKED_IN,
        checkOutDate: LessThanOrEqual(truncatedToday),
      },
      { status: BookingStatus.CHECKED_OUT },
    );

    if (result.affected === 0) {
      this.logger.warn(
        `updateBookingStatusToCheckedOut: No bookings found to update for date: ${truncatedToday.toISOString()}`,
      );

      return;
    }

    this.logger.log(
      `updateBookingStatusToCheckedOut: Successfully updated ${result.affected} bookings for date: ${truncatedToday.toISOString()}`,
    );
  }

  async updateBookingStatusToCheckedIn() {
    const truncatedToday = this.truncateDateToYearMonthDay(new Date());

    this.logger.log(
      `Starting updateBookingStatusToCheckedIn for date: ${truncatedToday.toISOString()}`,
    );

    const result = await this.bookingRepository.update(
      {
        status: BookingStatus.CONFIRMED,
        checkInDate: LessThanOrEqual(truncatedToday),
      },
      { status: BookingStatus.CHECKED_IN },
    );

    if (result.affected === 0) {
      this.logger.warn(
        `updateBookingStatusToCheckedIn: No bookings found to update for date: ${truncatedToday.toISOString()}`,
      );

      return;
    }

    this.logger.log(
      `updateBookingStatusToCheckedIn: Successfully updated ${result.affected} bookings for date: ${truncatedToday.toISOString()}`,
    );
  }

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

    const allowedStatusTransitions = BookingStatusTransitions[booking.status];

    if (!allowedStatusTransitions.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${booking.status} to status ${dto.status}`,
      );
    }

    booking.status = dto.status;

    const updatedBooking = await this.bookingRepository.save(booking);
    if (dto.status === BookingStatus.CONFIRMED) {
      this.notificationService.emitNotification(
        'booking.status.confirmed',
        bookingId,
      );
    } else if (dto.status === BookingStatus.CHECKED_OUT) {
      this.notificationService.emitNotification(
        'booking.status.review',
        bookingId,
      );
    } else {
      this.notificationService.emitNotification(
        'booking.status.changed',
        bookingId,
      );
    }

    return updatedBooking;
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['user', 'accommodation'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    return booking;
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

  private truncateDateToYearMonthDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
