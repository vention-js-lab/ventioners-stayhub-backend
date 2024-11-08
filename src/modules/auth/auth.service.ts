import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/request/register.dto';
import { Hasher } from '../../shared/libs/hasher.lib';
import { UsersRepository } from '../users/users.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists in the system');
    }

    const hashedPassword = await Hasher.hashValue(registerDto.password);

    const createdUser = await this.usersRepository.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { sub: createdUser.id, userEmail: createdUser.email };
    const accessToken = await this.generateAccessToken(payload);

    return { accessToken };
  }

  async generateAccessToken(payload: { sub: string; userEmail: string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('AUTH_ACCESS_TOKEN_EXPIRES_IN'),
    });

    return accessToken;
  }
}
