import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from '../bookings.controller';
import { BookingsService } from '../bookings.service';
import {
  BookingDto,
  BookingDtoWithAccommodation,
  BookingDtoWithAccommodationAndUserId,
  BookingDtoWithUserAndAccommodation,
} from '../dto/response';
import {
  BookingsQueryParamsReqDto,
  CreateBookingReqDto,
  UpdateBookingStatusReqDto,
} from '../dto/request';
import {
  mockBooking,
  mockCreatedBooking,
  mockMyBookings,
  mockUpdatedBooking,
} from './bookings.mock';
import { BookingStatus } from '../constants/booking-status.constant';
import { mockUsers } from 'src/modules/users/test/users.mock';

describe('BookingsController', () => {
  let controller: BookingsController;
  // eslint-disable-next-line
  let service: BookingsService;

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
              .mockResolvedValue(mockMyBookings),
            getBooking: jest
              .fn<
                Promise<BookingDtoWithUserAndAccommodation>,
                [string, string]
              >()
              .mockResolvedValue(mockBooking),
            createBooking: jest
              .fn<
                Promise<BookingDtoWithAccommodationAndUserId>,
                [CreateBookingReqDto, string]
              >()
              .mockResolvedValue(mockCreatedBooking),
            updateStatus: jest
              .fn<
                Promise<BookingDto>,
                [UpdateBookingStatusReqDto, string, string]
              >()
              .mockResolvedValue(mockUpdatedBooking),
          },
        },
      ],
    }).compile();

    controller = module.get(BookingsController);
    service = module.get(BookingsService);
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

      expect(result).toEqual({ data: mockMyBookings });
    });
  });

  describe('getBooking', () => {
    it('returns booking', async () => {
      const result = await controller.getBooking(mockUsers[0], '1');

      expect(result).toEqual({ data: mockBooking });
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

      expect(result).toEqual({ data: mockCreatedBooking });
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

      expect(result).toEqual({ data: mockUpdatedBooking });
    });
  });
});
