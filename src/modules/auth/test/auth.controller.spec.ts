import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../dto/request/register.dto';
import { CookieOptions, Response } from 'express';
import { LoginDto } from '../dto/request/login.dto';
import { JwtPayload } from '../auth.types';
import { mockUsers } from 'src/modules/users/test/users.mock';
import { UpdatePasswordDto } from '../dto/request/update-password.dto';
import { RedisService } from 'src/redis/redis.service';

const mockRes = {
  cookie: jest.fn<Response, [string, string, CookieOptions]>().mockReturnThis(),
  clearCookie: jest.fn(),
} as unknown as Response;

const mockTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
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
        case 'NODE_ENV':
          return 'production';
      }
    }),
};

const mockRedisService = {
  blacklistRefreshToken: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerPendingUser: jest
              .fn<Promise<{ message: string; email: string }>, [RegisterDto]>()
              .mockResolvedValue({
                message: 'Registration initiated. Please verify your email.',
                email: 'example@example.com',
              }),
            login: jest
              .fn<
                Promise<{ accessToken: string; refreshToken: string }>,
                [LoginDto]
              >()
              .mockResolvedValue(mockTokens),
            generateToken: jest
              .fn<Promise<string>, ['ACCESS' | 'REFRESH', JwtPayload]>()
              .mockImplementation((tokenType: 'ACCESS' | 'REFRESH') =>
                Promise.resolve(
                  tokenType === 'ACCESS'
                    ? mockTokens.accessToken
                    : mockTokens.refreshToken,
                ),
              ),
            updatePassword: jest.fn().mockResolvedValue(mockTokens),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('registers a pending user', async () => {
      const registerDto: RegisterDto = {
        email: 'example@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: '123123123',
      };

      const result = await controller.register(registerDto);

      expect(result.data).toHaveProperty(
        'message',
        'Registration initiated. Please verify your email.',
      );

      expect(result.data).toHaveProperty('email', registerDto.email);
    });
  });

  describe('login', () => {
    it("logs in a user and sets the user's access and refresh tokens as cookies", async () => {
      const loginDto: LoginDto = {
        email: 'example@example.com',
        password: '123123123',
      };

      await controller.login(loginDto, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'accessToken',
        mockTokens.accessToken,
        {
          httpOnly: true,
          secure: true,
          maxAge: 900000,
        },
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        {
          httpOnly: true,
          secure: true,
          maxAge: 604800000,
        },
      );
    });
  });

  describe('logout', () => {
    it('clears the access and refresh tokens from the cookies', async () => {
      await controller.logout(mockRes, 'refresh-token');

      expect(mockRes.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('refresh', () => {
    it('refreshes tokens and returns them as cookies', async () => {
      const jwtPayload: JwtPayload = {
        sub: mockUsers[0].id,
        userEmail: mockUsers[0].email,
      };

      await controller.refresh(mockUsers[0], 'refresh-token', mockRes);

      expect(service.generateToken).toHaveBeenCalledWith('ACCESS', jwtPayload);
      expect(service.generateToken).toHaveBeenCalledWith('REFRESH', jwtPayload);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'accessToken',
        mockTokens.accessToken,
        {
          httpOnly: true,
          secure: true,
          maxAge: 900000,
        },
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        {
          httpOnly: true,
          secure: true,
          maxAge: 604800000,
        },
      );
    });
  });

  describe('updatePassword', () => {
    it("updates a user's password", async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: 'old-password',
        newPassword: 'new-password',
      };

      await controller.updatePassword(
        mockUsers[0],
        updatePasswordDto,
        mockRes,
        'refresh-token',
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'accessToken',
        mockTokens.accessToken,
        {
          httpOnly: true,
          secure: true,
          maxAge: 900000,
        },
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        {
          httpOnly: true,
          secure: true,
          maxAge: 604800000,
        },
      );
    });
  });

  describe('logout', () => {
    it('clears the access and refresh tokens from the cookies', async () => {
      await controller.logout(mockRes, 'refresh-token');

      expect(mockRes.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refreshToken');
    });
  });
});
