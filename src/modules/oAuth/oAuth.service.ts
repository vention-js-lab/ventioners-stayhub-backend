import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OAuthService {
  constructor(
    private userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async googleLogin(payload: any) {
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
    const accessToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: this.configService.get('AUTH_ACCESS_TOKEN_EXPIRES_IN') },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: this.configService.get('AUTH_REFRESH_TOKEN_EXPIRES_IN') },
    );

    return {
      message: 'User information from google',
      user: user,
      accessToken,
      refreshToken,
    };
  }
}
