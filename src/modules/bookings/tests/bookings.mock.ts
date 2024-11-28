import { BookingStatus } from '../constants/booking-status.constant';
import {
  BookingDto,
  BookingDtoWithAccommodation,
  BookingDtoWithAccommodationAndUserId,
  BookingDtoWithUserAndAccommodation,
} from '../dto/response';
import { omit } from 'src/shared/helpers/omit-from-object.helper';
import { mockUsers } from 'src/modules/users/test/users.mock';
import { UserDto } from 'src/modules/users/dto/response';

const mockUser = mockUsers[0] as UserDto;

export const mockMyBookings: BookingDtoWithAccommodation[] = [
  {
    id: '1',
    checkInDate: new Date('2021-09-01'),
    checkOutDate: new Date('2021-09-10'),
    accommodation: {
      id: '1',
      name: 'Hotel California',
      description:
        'You can check out any time you like, but you can never leave',
      images: ['https://example.com/hotel-california.jpg'],
      location: 'California, USA',
      pricePerNight: 1000,
      createdAt: new Date('2021-08-01'),
      updatedAt: new Date('2021-08-01'),
    },
    status: BookingStatus.CONFIRMED,
    totalPrice: 9000,
    numberOfGuests: 5,
    createdAt: new Date('2021-08-01'),
    updatedAt: new Date('2021-08-01'),
  },
  {
    id: '2',
    checkInDate: new Date('2021-10-01'),
    checkOutDate: new Date('2021-10-10'),
    accommodation: {
      id: '2',
      name: 'Hotel California II',
      description:
        'You can check out any time you like, but you can never leave',
      images: ['https://example.com/hotel-california-ii.jpg'],
      location: 'California, USA',
      pricePerNight: 2000,
      createdAt: new Date('2021-08-01'),
      updatedAt: new Date('2021-08-01'),
    },
    status: BookingStatus.PENDING,
    totalPrice: 18000,
    numberOfGuests: 9,
    createdAt: new Date('2021-08-01'),
    updatedAt: new Date('2021-08-01'),
  },
];

export const mockBooking: BookingDtoWithUserAndAccommodation = {
  ...mockMyBookings[0],
  accommodation: {
    ...mockMyBookings[0].accommodation,
    owner: {
      ...mockUser,
    },
  },
  user: {
    ...mockUser,
  },
};

export const mockCreatedBooking: BookingDtoWithAccommodationAndUserId = {
  ...mockBooking,
  accommodation: {
    id: '1',
  },
  user: {
    id: '1',
  },
};

export const mockUpdatedBooking: BookingDto = {
  ...(omit(mockBooking, ['accommodation', 'user']) as BookingDto),
};
