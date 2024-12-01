import { Amenity } from 'src/modules/amenities/entities';
import { Accommodation, Image } from '../../entities';
import { AccommodationCategory } from 'src/modules/categories/entities';
import { User } from 'src/modules/users/entities/user.entity';

export const mockAccommodations: Accommodation[] = [
  {
    id: '1',
    name: 'Accommodation 1',
    description: 'Description 1',
    images: [
      {
        id: 'b2bb8372-3327-4e5b-937d-b23a200da528',
        url: 'random_url',
        order: 1,
      },
      {
        id: 'a1391b5a-a9c3-409b-b60b-7006f8ba7ca3',
        url: 'random_url_2',
        order: 2,
      },
    ] as Image[],
    createdAt: new Date(),
    updatedAt: new Date(),
    location: 'Moon',
    pricePerNight: 200,
    owner: {
      id: '3',
      email: 'clyde@gmail.com',
      passwordHash:
        '$argon2id$v=19$m=65536,t=3,p=4$i0afIGeB84+hyDDD2xRO5g$/mG+NW+q8enwVNjrZZYFqNgevpwE3z14Vda/GyA8r7g',
      firstName: 'clyde',
      lastName: 'clyde',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User,
    category: {
      id: 'c7f98ee8-ad70-43f7-8348-380a007b5eab',
      name: 'Villas',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as AccommodationCategory,
    amenities: [
      {
        id: '1',
        name: 'Pool',
        description: 'Pool',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as Amenity[],
  },
];
