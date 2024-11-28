import { Accommodation, Image } from '../../entities';
import { mockAccommodations } from './accommodations.mock';

export const mockImages: Image[] = [
  {
    id: '1',
    url: 'https://www.example.com/image.jpg',
    order: 0,
    accommodation: { ...mockAccommodations[0] } as Accommodation,
  },
  {
    id: '2',
    url: 'https://www.example.com/image.jpg',
    order: 1,
    accommodation: { ...mockAccommodations[0] } as Accommodation,
  },
];
