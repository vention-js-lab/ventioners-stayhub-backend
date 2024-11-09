import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OAuthService {
  constructor(
    readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  async googleLogin(req) {
    const user = await this.userRepository.getUserBy({
      email: req.user.email,
    });

    if (user) {
      const accessToken = this.jwtService.sign(
        { id: user.id },
        { expiresIn: '72h' },
      );
      const refreshToken = this.jwtService.sign(
        { id: user.id },
        { expiresIn: '30d' },
      );

      return {
        message: 'User information from google',
        user: req.user,
        accessToken,
        refreshToken,
      };
    } else {
      const user = await this.userRepository.createUser({
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        password: '',
      });
      const accessToken = this.jwtService.sign(
        { id: user.id },
        { expiresIn: '72h' },
      );
      const refreshToken = this.jwtService.sign(
        { id: user.id },
        { expiresIn: '30d' },
      );

      return {
        message: 'User information from google',
        user: req.user,
        accessToken,
        refreshToken,
      };
    }
  }
}
