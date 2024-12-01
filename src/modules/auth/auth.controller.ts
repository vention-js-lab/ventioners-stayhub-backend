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
import { User } from '../users/entities/user.entity';
import { UpdatePasswordDto } from './dto/request/update-password.dto';
import { AuthTokenGuard } from 'src/shared/guards';

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

    this.setCookies(res, tokens);
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

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  @Post('update-password')
  @UseGuards(AuthTokenGuard)
  async updatePassword(
    @GetUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.updatePassword(
      updatePasswordDto,
      user,
    );

    this.setCookies(res, tokens);
  }

  private setCookies(
    res: Response,
    tokens: Awaited<ReturnType<typeof this.authService.register>>,
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

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      userEmail: user.email,
    };

    const accessToken = await this.authService.generateToken(
      'ACCESS',
      jwtPayload,
    );
    const newRefreshToken = await this.authService.generateToken(
      'REFRESH',
      jwtPayload,
    );

    this.setCookies(res, { accessToken, refreshToken: newRefreshToken });
  }
}
