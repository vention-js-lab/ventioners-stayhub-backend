import { User } from '../entities/user.entity';
import { UserRole } from 'src/shared/constants';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'example@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    passwordHash: 'password',
    role: UserRole.USER,
    wishlist: ['accommodation-1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'example2@gmail.com',
    firstName: 'John',
    lastName: 'Snow',
    passwordHash: 'password',
    role: UserRole.USER,
    wishlist: ['accommodation-1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
