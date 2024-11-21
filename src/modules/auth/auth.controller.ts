import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/request/register.dto';
import { LoginDto } from './dto/request/login.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenGuard } from './guards';
import { JwtPayload } from './auth.types';
import { GetUser } from 'src/shared/decorators';
import { isProd } from 'src/shared/helpers';
import ms from 'ms';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(registerDto);

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

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginDto);

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

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @GetUser() payload: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.generateToken('ACCESS', payload);
    const newRefreshToken = await this.authService.generateToken(
      'REFRESH',
      payload,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd(this.configService.get('NODE_ENV')),
      maxAge: ms(
        this.configService.get<string>('AUTH_ACCESS_TOKEN_EXPIRES_IN'),
      ),
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProd(this.configService.get('NODE_ENV')),
      maxAge: ms(
        this.configService.get<string>('AUTH_REFRESH_TOKEN_EXPIRES_IN'),
      ),
    });
  }
}
