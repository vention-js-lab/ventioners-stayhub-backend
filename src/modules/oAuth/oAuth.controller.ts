import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { OAuthService } from './oAuth.service';
import { GetUser } from 'src/shared/decorators';
import { OAuthResponse } from './oAuth.types';
import ms from 'ms';
import { isProd } from 'src/shared/helpers';

@Controller('auth')
export class OAuthController {
  constructor(
    private readonly oAuthService: OAuthService,
    private configService: ConfigService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @GetUser() user: OAuthResponse,
    @Res() res: Response,
  ) {
    const tokens = await this.oAuthService.googleLogin(user);

    this.setCookies(res, tokens);

    res.redirect(this.configService.get('GOOGLE_CLIENT_REDIRECT_URL'));
  }

  private setCookies(
    res: Response,
    tokens: Awaited<ReturnType<typeof this.oAuthService.googleLogin>>,
  ) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProd(this.configService.get('NODE_ENV')),
      maxAge: ms(
        this.configService.get<string>('AUTH_ACCESS_TOKEN_EXPIRES_IN'),
      ),
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProd(this.configService.get('NODE_ENV')),
      maxAge: ms(
        this.configService.get<string>('AUTH_REFRESH_TOKEN_EXPIRES_IN'),
      ),
    });
  }
}
