import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/request/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
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
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = await this.authService.verifyRefreshToken(refreshToken);

    if (!payload) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Invalid refresh token');
    }

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
