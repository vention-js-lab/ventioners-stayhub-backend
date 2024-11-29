import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/request/register.dto';
import { Hasher } from '../../shared/libs/hasher.lib';
import { UsersRepository } from '../users/users.repository';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/request/login.dto';
import { JwtPayload } from './auth.types';
import { UpdatePasswordDto } from './dto/request/update-password.dto';
import { User } from '../users/entities/user.entity';

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
    const accessToken = await this.generateToken('ACCESS', payload);
    const refreshToken = await this.generateToken('REFRESH', payload);

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await Hasher.verifyHash(
      user.passwordHash,
      loginDto.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload = { sub: user.id, userEmail: user.email };
    const accessToken = await this.generateToken('ACCESS', payload);
    const refreshToken = await this.generateToken('REFRESH', payload);

    return { accessToken, refreshToken };
  }

  async updatePassword(dto: UpdatePasswordDto, user: User) {
    const isPasswordValid = await Hasher.verifyHash(
      user.passwordHash,
      dto.oldPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const hashedPassword = await Hasher.hashValue(dto.newPassword);

    const updatedUser = await this.usersRepository.updateUser(
      { passwordHash: hashedPassword },
      user.id,
    );

    const payload = { sub: updatedUser.id, userEmail: updatedUser.email };
    const accessToken = await this.generateToken('ACCESS', payload);
    const refreshToken = await this.generateToken('REFRESH', payload);

    return { accessToken, refreshToken };
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
