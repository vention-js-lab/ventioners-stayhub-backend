import { Test, TestingModule } from '@nestjs/testing';
import { OAuthService } from '../oAuth.service';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/modules/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { mockUsers } from 'src/modules/users/test/users.mock';
import { FindOptionsWhere } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateUserReqDto } from 'src/modules/users/dto/request';
import { GoogleUserCreateDto } from '../dtos';
import { JwtPayload } from 'src/modules/auth/auth.types';

const mockTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

const mockUsersRepository = {
  getUserBy: jest
    .fn<Promise<User | null>, [FindOptionsWhere<User>]>()
    .mockImplementation((options) => {
      if (options.email === 'existingemail@gmail.com') {
        return Promise.resolve(mockUsers[0]);
      }

      return Promise.resolve(null);
    }),
  createUser: jest
    .fn<Promise<User>, [CreateUserReqDto]>()
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
      return mockTokens.accessToken;
    }

    return mockTokens.refreshToken;
  }),
};

describe('OAuthService', () => {
  let service: OAuthService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<OAuthService>(OAuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('googleLogin', () => {
    const payload: GoogleUserCreateDto = {
      email: 'existingemail@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('authenticates existing user and returns tokens', async () => {
      const result = await service.googleLogin(payload);

      expect(result).toEqual(mockTokens);
    });

    it("creates a new user and returns the user's access and refresh tokens", async () => {
      const result = await service.googleLogin({
        ...payload,
        email: 'newuser@gmail.com',
      });

      expect(result).toEqual(mockTokens);

      expect(usersRepository.createUser).toHaveBeenCalledWith({
        ...payload,
        email: 'newuser@gmail.com',
        password: '',
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
});
