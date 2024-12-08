import { Response, CookieOptions } from 'express';
import { OAuthController } from '../oAuth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { OAuthService } from '../oAuth.service';
import { GoogleUserCreateDto } from '../dtos';
import { ConfigService } from '@nestjs/config';
import { OAuthResponse } from '../oAuth.types';
import { RedisService } from 'src/redis/redis.service';

const mockRes = {
  cookie: jest.fn<Response, [string, string, CookieOptions]>().mockReturnThis(),
  redirect: jest.fn<Response, [string]>(),
} as unknown as Response;

const mockTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

const mockConfigSerivice = {
  get: jest
    .fn<string | boolean, [string]>()
    .mockImplementation((key: string) => {
      switch (key) {
        case 'NODE_ENV':
          return 'production';
        case 'AUTH_ACCESS_TOKEN_EXPIRES_IN':
          return '15m';
        case 'AUTH_REFRESH_TOKEN_EXPIRES_IN':
          return '7d';
        case 'GOOGLE_CLIENT_REDIRECT_URL':
          return 'http://localhost:4000';
      }
    }),
};

const mockRedisService = {
  blacklistRefreshToken: jest.fn(),
};

describe('OAuthController', () => {
  let controller: OAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OAuthController],
      providers: [
        {
          provide: OAuthService,
          useValue: {
            googleLogin: jest
              .fn<
                Promise<{ accessToken: string; refreshToken: string }>,
                [GoogleUserCreateDto]
              >()
              .mockResolvedValue(mockTokens),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigSerivice,
        },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    controller = module.get<OAuthController>(OAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuth', () => {
    it("redirects to google's oauth", async () => {
      expect(controller.googleAuth()).resolves.toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it("returns the user's tokens and logins or register a user", async () => {
      const oAuthResponse: OAuthResponse = {
        picture: 'picture',
        refreshToken: mockTokens.refreshToken,
        accessToken: mockTokens.accessToken,
        email: 'example@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      await controller.googleAuthRedirect(
        oAuthResponse,
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

      expect(mockRes.redirect).toHaveBeenCalledWith('http://localhost:4000');
    });
  });
});
