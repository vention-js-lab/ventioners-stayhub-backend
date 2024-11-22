import { AccommodationDto } from 'src/modules/accommodations/dto';

export const mockAccommodations: AccommodationDto[] = [
  {
    id: '1',
    name: 'Test Accommodation',
    description: 'Test Description',
    images: ['test.jpg'],
    location: 'Test Location',
    pricePerNight: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Test Accommodation 2',
    description: 'Test Description 2',
    images: ['test2.jpg'],
    location: 'Test Location 2',
    pricePerNight: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
