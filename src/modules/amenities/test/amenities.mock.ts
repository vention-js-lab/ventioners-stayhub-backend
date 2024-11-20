import { AmenityDto } from '../dto/response';

export const mockAmenities: AmenityDto[] = [
  {
    id: '1',
    name: 'Wifi',
    description: 'Wireless Internet',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Parking',
    description: 'Free parking on premises',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
