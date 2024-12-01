import { AccommodationDto } from 'src/modules/accommodations/dto';

export const mockAccommodations: AccommodationDto[] = [
  {
    id: '1',
    name: 'Test Accommodation',
    description: 'Test Description',
    images: [
      {
        id: '1',
        url: 'test.jpg',
        order: 1,
      },
    ],
    location: 'Test Location',
    pricePerNight: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Test Accommodation 2',
    description: 'Test Description 2',
    images: [
      {
        id: '1',
        url: 'test.jpg',
        order: 1,
      },
    ],
    location: 'Test Location 2',
    pricePerNight: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
