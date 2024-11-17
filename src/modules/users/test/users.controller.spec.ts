import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UserSearchParamsReqDto } from '../dto/request/user-search-params.dto';
import { User } from '../entities/user.entity';
import { CreateUserReqDto } from '../dto/request/create-user.dto';
import { UpdateUserReqDto } from '../dto/request/update-user.dto';
import { mockUsers } from './users.mock';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  // eslint-disable-next-line
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest
              .fn<
                Promise<{
                  users: User[];
                  totalCount: number;
                  totalPages: number;
                }>,
                [UserSearchParamsReqDto]
              >()
              .mockResolvedValue({
                users: mockUsers,
                totalCount: mockUsers.length,
                totalPages: 1,
              }),
            getUser: jest
              .fn<Promise<User>, [string]>()
              .mockResolvedValue(mockUsers[0]),
            createUser: jest
              .fn<Promise<User>, [CreateUserReqDto]>()
              .mockResolvedValue(mockUsers[0]),
            updateUser: jest
              .fn<Promise<User>, [UpdateUserReqDto, string]>()
              .mockResolvedValue(mockUsers[0]),
            deleteUser: jest.fn<Promise<void>, [string]>().mockResolvedValue(),
            wishlistAccommodation: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('someValue'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('someSignedToken'),
          },
        },
      ],
    }).compile();

    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('returns a list of users', () => {
      expect(controller.getUsers({})).resolves.toEqual({
        data: mockUsers,
        totalCount: mockUsers.length,
        totalPages: 1,
      });
    });
  });

  describe('getUser', () => {
    it("returns a user's information", () => {
      expect(controller.getUser('1')).resolves.toEqual({
        data: mockUsers[0],
      });
    });
  });

  describe('createUser', () => {
    it('creates a new user and returns their information', () => {
      const createUserDto: CreateUserReqDto = {
        email: mockUsers[0].email,
        password: mockUsers[0].passwordHash,
        firstName: mockUsers[0].firstName,
        lastName: mockUsers[0].lastName,
      };

      expect(controller.createUser(createUserDto)).resolves.toEqual({
        data: mockUsers[0],
      });
    });
  });

  describe('updateUser', () => {
    it("updates a user's information and returns the updated user", () => {
      const updateUserDto: UpdateUserReqDto = {
        email: mockUsers[0].email,
        firstName: mockUsers[0].firstName,
        lastName: mockUsers[0].lastName,
      };

      expect(controller.updateUser(updateUserDto, '1')).resolves.toEqual({
        data: mockUsers[0],
      });
    });
  });

  describe('deleteUser', () => {
    it('deletes a user', () => {
      expect(controller.deleteUser('1')).resolves.toBeUndefined();
    });
  });

  describe('wishlistAccommodation', () => {
    it('should add accommodation to wishlist if not already in', async () => {
      const userId = mockUsers[0].id;
      const accommodationId = 'accommodation-2'; // New accommodation ID
      const mockRequest = { user: { sub: userId } }; // Mocking the request object

      // Mock the service method to resolve successfully
      jest.spyOn(service, 'wishlistAccommodation').mockResolvedValue(undefined);

      await expect(
        controller.wishlistAccommodation(accommodationId, mockRequest),
      ).resolves.not.toThrow();

      // Check if the service method was called with the correct arguments
      expect(service.wishlistAccommodation).toHaveBeenCalledWith(
        userId,
        accommodationId,
      );
    });

    it('should remove accommodation from wishlist if already in', async () => {
      const userId = mockUsers[0].id;
      const accommodationId = 'accommodation-1'; // Already in the wishlist
      const mockRequest = { user: { sub: userId } };

      // Mock the service method to resolve successfully
      jest.spyOn(service, 'wishlistAccommodation').mockResolvedValue(undefined);

      await expect(
        controller.wishlistAccommodation(accommodationId, mockRequest),
      ).resolves.not.toThrow();

      // Check if the service method was called with the correct arguments
      expect(service.wishlistAccommodation).toHaveBeenCalledWith(
        userId,
        accommodationId,
      );
    });

    it('should throw NotFoundException if user or accommodation not found', async () => {
      const userId = 'non-existing-user-id'; // Invalid user ID
      const accommodationId = 'accommodation-1'; // Valid accommodation ID
      const mockRequest = { user: { sub: userId } };

      // Simulate the service throwing an error
      jest
        .spyOn(service, 'wishlistAccommodation')
        .mockRejectedValue(new Error('Not found'));

      await expect(
        controller.wishlistAccommodation(accommodationId, mockRequest),
      ).rejects.toThrowError('User or accommodation not found');
    });
  });
});
