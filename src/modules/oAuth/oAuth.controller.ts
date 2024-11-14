import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import {
  Controller,
  Get,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OAuthService } from './oAuth.service';
import { ConfigService } from '@nestjs/config';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { Response } from 'express';
import { REFRESH_TOKEN_COOKIE_AGE } from 'src/shared/constants';

@Controller('auth')
export class OAppController {
  constructor(
    private readonly appService: OAuthService,
    private configService: ConfigService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@GetUser() user, @Res() res: Response) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    const tokens = await this.appService.googleLogin(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: REFRESH_TOKEN_COOKIE_AGE,
    });

    const redirectUrl = `${this.configService.get('GOOGLE_CLIENT_REDIRECT_URL')}?accessToken=${tokens.accessToken}`;
    res.redirect(redirectUrl);
  }
}
