import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/request/register.dto';
import { UsersRepository } from 'src/modules/users/users.repository';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { mockUsers } from 'src/modules/users/test/users.mock';
import { Hasher } from 'src/shared/libs';
import { CreateUserReqDto } from 'src/modules/users/dto/request';
import { LoginDto } from '../dto/request/login.dto';
import { JwtPayload } from '../auth.types';
import { RedisService } from 'src/redis/redis.service';
import { MailerService } from 'src/modules/mail/mail.service';

const mockUsersRepository = {
  findOne: jest
    .fn<Promise<User | null>, [FindOneOptions<User>]>()
    .mockImplementation((options: { where: FindOptionsWhere<User> }) => {
      if (options.where?.email === 'existingemail@gmail.com') {
        return Promise.resolve(mockUsers[0]);
      }

      return Promise.resolve(null);
    }),
  createUser: jest
    .fn<Promise<User>, [CreateUserReqDto]>()
    .mockResolvedValue(mockUsers[0]),
  updateUser: jest
    .fn<Promise<User>, [Partial<User>, string]>()
    .mockResolvedValue(mockUsers[0]),
};

const mockConfigService = {
  get: jest
    .fn<string | boolean, [string]>()
    .mockImplementation((key: string) => {
      switch (key) {
        case 'AUTH_REFRESH_TOKEN_EXPIRES_IN':
          return '7d';
        case 'AUTH_ACCESS_TOKEN_EXPIRES_IN':
          return '15m';
        case 'AUTH_ACCESS_TOKEN_SECRET':
          return 'access-token-secret';
        case 'AUTH_REFRESH_TOKEN_SECRET':
          return 'refresh-token-secret';
      }
    }),
};

const mockJwtService = {
  signAsync: jest.fn().mockImplementation(async (_payload, options) => {
    if (options.secret === 'access-token-secret') {
      return 'access-token';
    }

    return 'refresh-token';
  }),
};

const mockRedisService = {
  hGet: jest.fn(),
  hSet: jest.fn(),
  hDel: jest.fn(),
  hSetExpiryTime: jest.fn(),
  get: jest.fn(),
};

const mockMailerService = {
  sendVerificationEmail: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    Hasher.hashValue = jest
      .fn<Promise<string>, [string]>()
      .mockImplementation((password) => Promise.resolve('hashed-' + password));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register pending user', () => {
    const registerDto: RegisterDto = {
      email: 'existingemail@gmail.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('throws a BadRequestException when the email already exists', async () => {
      expect(service.registerPendingUser(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("registers pending a user and returns the user's email", async () => {
      const result = await service.registerPendingUser({
        ...registerDto,
        email: 'notexisting@gmail.com',
      });

      expect(result).toEqual({
        message: 'Registration initiated. Please verify your email.',
        email: 'notexisting@gmail.com',
      });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'existingemail@gmail.com',
      password: 'password',
    };

    it("throws a BadRequestException when the user doesn't exist", async () => {
      expect(
        service.login({ ...loginDto, email: 'notexisting@gmail.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws a BadRequestException when the password is invalid', async () => {
      Hasher.verifyHash = jest.fn().mockResolvedValueOnce(false);

      expect(service.login(loginDto)).rejects.toThrow(BadRequestException);
    });

    it("logins user and returns the user's access and refresh tokens", async () => {
      Hasher.verifyHash = jest.fn().mockResolvedValueOnce(true);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });

  describe('generateToken', () => {
    const payload: JwtPayload = {
      sub: '1',
      userEmail: 'example@gmail.com',
    };

    it('generates an acesss token based on the argument type and payload', async () => {
      const result = await service.generateToken('ACCESS', payload);

      expect(result).toBe('access-token');
    });

    it('generates a refresh token based on the argument type and payload', async () => {
      const result = await service.generateToken('REFRESH', payload);

      expect(result).toBe('refresh-token');
    });
  });

  describe('updatePassword', () => {
    it("throws a BadRequestException when the user's current password is invalid", async () => {
      Hasher.verifyHash = jest.fn().mockResolvedValueOnce(false);

      expect(
        service.updatePassword(
          {
            oldPassword: 'invalid-password',
            newPassword: 'new-password',
          },
          mockUsers[0],
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it("updates the user's password and returns the user's access and refresh tokens", async () => {
      Hasher.verifyHash = jest.fn().mockResolvedValueOnce(true);

      const result = await service.updatePassword(
        {
          oldPassword: 'password',
          newPassword: 'new-password',
        },
        mockUsers[0],
      );

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });
});
