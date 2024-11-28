import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleUserCreateDto } from './dtos';
import { JwtPayload } from '../auth/auth.types';

@Injectable()
export class OAuthService {
  constructor(
    private userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async googleLogin(payload: GoogleUserCreateDto) {
    let user = await this.userRepository.getUserBy({
      email: payload?.email,
    });

    if (!user) {
      user = await this.userRepository.createUser({
        email: payload?.email,
        firstName: payload?.firstName,
        lastName: payload?.lastName,
        password: '',
      });
    }

    const accessToken = await this.generateToken('ACCESS', {
      sub: user.id,
      userEmail: user.email,
    });

    const refreshToken = await this.generateToken('REFRESH', {
      sub: user.id,
      userEmail: user.email,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateToken(tokenType: 'REFRESH' | 'ACCESS', payload: JwtPayload) {
    const token = await this.jwtService.signAsync(
      { sub: payload.sub, userEmail: payload.userEmail },
      {
        secret: this.configService.get(`AUTH_${tokenType}_TOKEN_SECRET`),
        expiresIn: this.configService.get(`AUTH_${tokenType}_TOKEN_EXPIRES_IN`),
      },
    );

    return token;
  }
}
