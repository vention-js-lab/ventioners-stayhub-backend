import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../dto/request/register.dto';
import { CookieOptions, Response } from 'express';
import { LoginDto } from '../dto/request/login.dto';
import { JwtPayload } from '../auth.types';
import { mockUsers } from 'src/modules/users/test/users.mock';

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
            register: jest
              .fn<
                Promise<{ accessToken: string; refreshToken: string }>,
                [RegisterDto]
              >()
              .mockResolvedValue(mockTokens),
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
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
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
    it("registers a user and sets the user's access and refresh tokens as cookies", async () => {
      const registerDto: RegisterDto = {
        email: 'example@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: '123123123',
      };

      await controller.register(registerDto, mockRes);

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
      await controller.logout(mockRes);

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

      await controller.refresh(mockUsers[0], mockRes);

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
});
