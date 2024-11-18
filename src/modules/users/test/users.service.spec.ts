import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { mockUsers } from './users.mock';
import { UsersRepository } from '../users.repository';
import { CreateUserReqDto, UpdateUserReqDto } from '../dto/request';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';

const mockUser = mockUsers[0];

const mockUsersRepository = {
  getAllUsers: jest.fn().mockResolvedValue({
    users: mockUsers,
    totalCount: mockUsers.length,
    totalPages: 1,
  }),
  getUserBy: jest.fn().mockImplementation((options: FindOptionsWhere<User>) => {
    if (options.id) {
      return options.id === 'existing-user-id' ? mockUser : null;
    } else if (options.email) {
      return options.email === 'existingemail@gmail.com' ? mockUser : null;
    }
  }),
  createUser: jest.fn().mockResolvedValue(mockUser),
  updateUser: jest.fn().mockImplementation((_dto, userId) => {
    return userId === 'existing-user-id' ? mockUser : null;
  }),
  deleteUser: jest.fn().mockImplementation((userId: string) => ({
    affected: userId === 'existing-user-id' ? 1 : 0,
  })),
  save: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
};

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('returns a list of users', async () => {
      expect(service.getUsers({})).resolves.toEqual({
        users: mockUsers,
        totalCount: mockUsers.length,
        totalPages: 1,
      });
    });
  });

  describe('getUser', () => {
    it('returns a user information', async () => {
      expect(service.getUser('existing-user-id')).resolves.toEqual(mockUser);
    });

    it('should throw NotFoundException if user does not exist', () => {
      expect(service.getUser('non-existing-user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('creates a user and return it', () => {
      const createUserDto: CreateUserReqDto = {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: 'newemail@example.com',
        password: 'password123',
      };

      expect(service.createUser(createUserDto)).resolves.toEqual(mockUser);
    });

    it('throws BadRequestException if user with email already exists', () => {
      const createUserDto: CreateUserReqDto = {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: 'existingemail@example.com',
        password: 'password123',
      };

      expect(service.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateUser', () => {
    it('updates a user and return it', async () => {
      const updateUserDto: UpdateUserReqDto = {
        email: 'update@gmail.com',
      };

      expect(
        service.updateUser(updateUserDto, 'existing-user-id'),
      ).resolves.toEqual(mockUser);
    });

    it('throws NotFoundException if user does not exist', async () => {
      const updateUserDto: UpdateUserReqDto = {
        email: 'update@gmail.com',
      };

      expect(
        service.updateUser(updateUserDto, 'non-existing-user-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('deletes a user and returns nothing', async () => {
      expect(service.deleteUser('existing-user-id')).resolves.toBeUndefined();
    });

    it('throws NotFoundException if user does not exist', async () => {
      expect(service.deleteUser('non-existing-user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('wishlistAccommodation', () => {
    it('should add accommodation to wishlist if not already in', async () => {
      const userId = 'existing-user-id';
      const accommodationId = 'accommodation-2';

      const updatedUser = await service.wishlistAccommodation(
        userId,
        accommodationId,
      );

      expect(updatedUser.wishlist).toContain(accommodationId);
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          wishlist: expect.arrayContaining([accommodationId]),
        }),
      );
    });

    it('should remove accommodation from wishlist if already in', async () => {
      const userId = 'existing-user-id';
      const accommodationId = 'accommodation-1';

      const updatedUser = await service.wishlistAccommodation(
        userId,
        accommodationId,
      );

      expect(updatedUser.wishlist).not.toContain(accommodationId);
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          wishlist: expect.arrayContaining([]),
        }),
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 'non-existing-user-id';
      const accommodationId = 'accommodation-2';

      await expect(
        service.wishlistAccommodation(userId, accommodationId),
      ).rejects.toThrow(
        new NotFoundException(`User with id ${userId} not found`),
      );
    });
  });
});
