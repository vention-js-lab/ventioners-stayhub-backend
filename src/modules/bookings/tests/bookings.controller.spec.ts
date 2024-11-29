import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from '../bookings.controller';
import { BookingsService } from '../bookings.service';
import {
  BookingDto,
  BookingDtoWithAccommodation,
  BookingDtoWithAccommodationAndUserId,
} from '../dto/response';
import {
  BookingsQueryParamsReqDto,
  CreateBookingReqDto,
  UpdateBookingStatusReqDto,
} from '../dto/request';
import { mockBookings } from './bookings.mock';
import { BookingStatus } from '../constants';
import { mockUsers } from 'src/modules/users/test/users.mock';
import { Booking } from '../entities/booking.entity';

describe('BookingsController', () => {
  let controller: BookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: {
            getMyBookings: jest
              .fn<
                Promise<BookingDtoWithAccommodation[]>,
                [BookingsQueryParamsReqDto, string]
              >()
              .mockResolvedValue(mockBookings),
            getBooking: jest
              .fn<Promise<Booking>, [string, string]>()
              .mockResolvedValue(mockBookings[0]),
            createBooking: jest
              .fn<
                Promise<BookingDtoWithAccommodationAndUserId>,
                [CreateBookingReqDto, string]
              >()
              .mockResolvedValue(mockBookings[0]),
            updateStatus: jest
              .fn<
                Promise<BookingDto>,
                [UpdateBookingStatusReqDto, string, string]
              >()
              .mockResolvedValue(mockBookings[0]),
          },
        },
      ],
    }).compile();

    controller = module.get(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyBookings', () => {
    it('returns bookings', async () => {
      const result = await controller.getMyBookings(
        { status: BookingStatus.PENDING },
        mockUsers[0],
      );

      expect(result).toEqual({ data: mockBookings });
    });
  });

  describe('getBooking', () => {
    it('returns booking', async () => {
      const result = await controller.getBooking(mockUsers[0], '1');

      expect(result).toEqual({ data: mockBookings[0] });
    });
  });

  describe('createBooking', () => {
    it('returns created booking', async () => {
      const createBookingDto: CreateBookingReqDto = {
        accommodationId: '1',
        checkInDate: new Date(),
        checkOutDate: new Date(),
        numberOfGuests: 1,
      };

      const result = await controller.createBooking(
        createBookingDto,
        mockUsers[0],
      );

      expect(result).toEqual({ data: mockBookings[0] });
    });
  });

  describe('updateBookingStatus', () => {
    it('returns updated booking', async () => {
      const updateBookingStatusDto: UpdateBookingStatusReqDto = {
        status: BookingStatus.CONFIRMED,
      };

      const result = await controller.updateStatus(
        updateBookingStatusDto,
        '1',
        mockUsers[0],
      );

      expect(result).toEqual({ data: mockBookings[0] });
    });
  });
});
