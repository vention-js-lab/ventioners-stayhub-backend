import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { generateToken } from 'src/shared';

@Injectable()
export class OAuthService {
  constructor(readonly userRepository: UsersRepository) {}
  async googleLogin(req) {
    const isUserExist = await this.userRepository.getUserBy({
      email: req.user.email,
    });

    if (isUserExist) {
      const accessToken = generateToken(isUserExist.id, '72h');
      const refreshToken = generateToken(isUserExist.id, '30d');

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
      const accessToken = generateToken(user.id, '72h');
      const refreshToken = generateToken(user.id, '30d');

      return {
        message: 'User information from google',
        user: req.user,
        accessToken,
        refreshToken,
      };
    }
  }
}
