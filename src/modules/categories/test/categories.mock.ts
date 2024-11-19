import { AccommodationCategory } from '../entities/category.entity';

export const mockCategories: AccommodationCategory[] = [
  {
    id: '1',
    name: 'Hotels',
    createdAt: new Date(),
    updatedAt: new Date(),
    accommodations: [],
  },
  {
    id: '2',
    name: 'Apartments',
    createdAt: new Date(),
    updatedAt: new Date(),
    accommodations: [],
  },
];
