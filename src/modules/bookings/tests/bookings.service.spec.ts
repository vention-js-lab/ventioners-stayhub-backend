import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from '../bookings.service';
import { AccommodationsService } from 'src/modules/accommodations/accommodations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { mockAccommodations } from 'src/modules/accommodations/test/mock/accommodations.mock';
import { FindOptionsWhere, Repository } from 'typeorm';
import { mockBookings } from './bookings.mock';
import { Accommodation } from 'src/modules/accommodations';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookingReqDto } from '../dto/request';
import { BookingStatus } from '../constants';
import { NotificationService } from 'src/modules/notifications/notification.service';

const mockAccommodationsService: Partial<AccommodationsService> = {
  getAccommodationById: jest.fn().mockResolvedValue(mockAccommodations[0]),
};

const mockBookingRepository: Partial<Repository<Booking>> = {
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockBookings),
    getCount: jest.fn(),
  }),
  findOne: jest
    .fn()
    .mockImplementation(
      (options: { where: FindOptionsWhere<Accommodation> }) => {
        const id = options.where.id;

        if (id === 'existing-id') {
          return Promise.resolve(mockBookings[0]);
        }

        return Promise.resolve(null);
      },
    ),
  save: jest.fn().mockResolvedValue(mockBookings[0]),
  create: jest.fn().mockReturnValue(mockBookings[0]),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const mockNotificationService = {
      emitNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: AccommodationsService,
          useValue: mockAccommodationsService,
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  describe('updateBookingStatusToCheckedOut', () => {
    it('updates the status of bookings to CHECKED_OUT', async () => {
      const result = await service.updateBookingStatusToCheckedOut();

      expect(result).toBeUndefined();
    });
  });

  describe('updateBookingStatusToCheckedIn', () => {
    it('updates the status of bookings to CHECKED_IN', async () => {
      const result = await service.updateBookingStatusToCheckedIn();

      expect(result).toBeUndefined();
    });
  });

  describe('getMyBookings', () => {
    it('returns all bookings of a user', async () => {
      const result = await service.getMyBookings({}, 'existing id');

      expect(result).toEqual(mockBookings);
    });
  });

  describe('getBooking', () => {
    it('returns a booking', async () => {
      const result = await service.getBooking('1', 'existing-id');

      expect(result).toEqual(mockBookings[0]);
    });

    it("throws a NotFoundException if the booking doesn't exist", async () => {
      expect(service.getBooking('1', 'non-existing-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws a UnauthorizedException if the user is not the author of the booking nor owner of the accommodation', async () => {
      expect(service.getBooking('another user', 'existing-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('createBooking', () => {
    const createBookingDto: CreateBookingReqDto = {
      accommodationId: 'existing-id',
      checkInDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1,
      ),
      checkOutDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 4,
      ),
      numberOfGuests: 4,
    };

    it('creates a booking', async () => {
      mockBookingRepository.createQueryBuilder().getCount = jest
        .fn()
        .mockResolvedValueOnce(0);

      const result = await service.createBooking(
        createBookingDto,
        'another user',
      );

      expect(result).toEqual(mockBookings[0]);
    });

    it('throws a BadRequestException if the user tries to book their own accommodation', async () => {
      expect(service.createBooking(createBookingDto, '3')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws a BadRequestException if the accommodation is already booked for the selected dates', () => {
      mockBookingRepository.createQueryBuilder().getCount = jest
        .fn()
        .mockResolvedValueOnce(1);

      expect(
        service.createBooking(createBookingDto, 'another user'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStatus', () => {
    it('throws a NotFoundException if the booking does not exist', async () => {
      expect(
        service.updateStatus(
          { status: BookingStatus.CONFIRMED },
          '1',
          'non-existing-id',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('updates the status successfully from PENDING to CONFIRMED', async () => {
      mockBookingRepository.findOne = jest.fn().mockResolvedValueOnce({
        ...mockBookings[0],
        status: BookingStatus.PENDING,
      });

      const result = await service.updateStatus(
        { status: BookingStatus.CONFIRMED },
        '2',
        'existing-id',
      );

      expect(result).toEqual(mockBookings[0]);
    });

    it('updates the status successfully from CONFIRMED to CHECKED_IN', async () => {
      mockBookingRepository.findOne = jest.fn().mockResolvedValueOnce({
        ...mockBookings[0],
        status: BookingStatus.CONFIRMED,
      });

      const result = await service.updateStatus(
        { status: BookingStatus.CHECKED_IN },
        '2',
        'existing-id',
      );

      expect(result).toEqual(mockBookings[0]);
    });

    it('updates the status successfully from CHECKED_IN to CHECKED_OUT', async () => {
      mockBookingRepository.findOne = jest.fn().mockResolvedValueOnce({
        ...mockBookings[0],
        status: BookingStatus.CHECKED_IN,
      });

      const result = await service.updateStatus(
        { status: BookingStatus.CHECKED_OUT },
        '2',
        'existing-id',
      );

      expect(result).toEqual(mockBookings[0]);
    });

    it('updates the status successfully from CHECKED_OUT to ARCHIVED', async () => {
      mockBookingRepository.findOne = jest.fn().mockResolvedValueOnce({
        ...mockBookings[0],
        status: BookingStatus.CHECKED_OUT,
      });

      const result = await service.updateStatus(
        { status: BookingStatus.ARCHIVED },
        '2',
        'existing-id',
      );

      expect(result).toEqual(mockBookings[0]);
    });

    it('throws a BadRequestException if the status is being updated from PENDING to CHECKED_OUT', async () => {
      mockBookingRepository.findOne = jest.fn().mockResolvedValueOnce({
        ...mockBookings[0],
        status: BookingStatus.PENDING,
      });

      expect(
        service.updateStatus(
          { status: BookingStatus.CHECKED_OUT },
          '2',
          'existing-id',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws a BadRequestException if the status is being updated from ARCHIVED to CONFIRMED', async () => {
      mockBookingRepository.findOne = jest.fn().mockResolvedValueOnce({
        ...mockBookings[0],
        status: BookingStatus.ARCHIVED,
      });

      expect(
        service.updateStatus(
          { status: BookingStatus.CONFIRMED },
          '2',
          'existing-id',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws a BadRequestException if the status is being updated from ARCHIVED to PENDING', async () => {
      mockBookingRepository.findOne = jest.fn().mockResolvedValueOnce({
        ...mockBookings[0],
        status: BookingStatus.ARCHIVED,
      });

      expect(
        service.updateStatus(
          { status: BookingStatus.PENDING },
          '2',
          'existing-id',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
