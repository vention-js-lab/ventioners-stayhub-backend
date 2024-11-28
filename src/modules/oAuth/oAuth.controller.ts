import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { OAuthService } from './oAuth.service';
import { GetUser } from 'src/shared/decorators';
import { OAuthResponse } from './oAuth.types';
import ms from 'ms';

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

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: ms(
        this.configService.get<string>('AUTH_ACCESS_TOKEN_EXPIRES_IN'),
      ),
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: ms(
        this.configService.get<string>('AUTH_REFRESH_TOKEN_EXPIRES_IN'),
      ),
    });

    res.redirect(this.configService.get('GOOGLE_CLIENT_REDIRECT_URL'));
  }
}
