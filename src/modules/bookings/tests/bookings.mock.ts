import { BookingStatus } from '../constants';
import { mockUsers } from 'src/modules/users/test/users.mock';
import { Booking } from '../entities/booking.entity';
import { Accommodation, Image } from 'src/modules/accommodations';
import { User } from 'src/modules/users/entities/user.entity';

export const mockBookings: Booking[] = [
  {
    id: '1',
    checkInDate: new Date('2021-09-01'),
    checkOutDate: new Date('2021-09-10'),
    accommodation: {
      id: '1',
      name: 'Hotel California',
      description:
        'You can check out any time you like, but you can never leave',
      images: [
        {
          id: '1',
          url: 'https://example.com/hotel-california.jpg',
          order: 1,
        },
      ] as Image[],
      owner: mockUsers[1] as User,
      location: 'California, USA',
      pricePerNight: 1000,
      createdAt: new Date('2021-08-01'),
      updatedAt: new Date('2021-08-01'),
    } as Accommodation,
    payments: [],
    user: mockUsers[0] as User,
    status: BookingStatus.PENDING,
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
      images: [
        {
          id: '1',
          url: 'https://example.com/hotel-california.jpg',
          order: 1,
        },
      ] as Image[],
      owner: mockUsers[0] as User,
      location: 'California, USA',
      pricePerNight: 2000,
      createdAt: new Date('2021-08-01'),
      updatedAt: new Date('2021-08-01'),
    } as Accommodation,
    payments: [],
    user: mockUsers[0] as User,
    status: BookingStatus.PENDING,
    totalPrice: 18000,
    numberOfGuests: 9,
    createdAt: new Date('2021-08-01'),
    updatedAt: new Date('2021-08-01'),
  },
];
