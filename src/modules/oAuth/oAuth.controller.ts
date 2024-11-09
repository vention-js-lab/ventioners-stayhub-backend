import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { OAuthService } from './oAuth.service';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: OAuthService) {}

  @Get('google/login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const tokens = await this.appService.googleLogin(req);
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    // we can redirect to the frontend app when the user is authenticated
    res.redirect('http://localhost:3000');
  }
}
