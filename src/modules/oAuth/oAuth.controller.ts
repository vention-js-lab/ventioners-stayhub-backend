import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import {
  Controller,
  Get,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OAuthService } from './oAuth.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/shared/decorators/user.decorator';

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
  async googleAuthRedirect(@User() user, @Response() res) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const tokens = await this.appService.googleLogin(user);
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    // we can redirect to the frontend app when the user is authenticated
    res.redirect(this.configService.get<string>('GOOGLE_CLIENT_REDIRECT_URL'));
  }
}
