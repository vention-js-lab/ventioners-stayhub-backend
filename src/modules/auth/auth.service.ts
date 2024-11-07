import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/request/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { Hasher } from 'src/shared/libs/hasher.lib';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, first_name, last_name } = registerDto;
    const hashedPassword = await Hasher.hashValue(password);

    const existingUser = await this.authRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists in the system');
    }

    const user = this.authRepository.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });
    await this.authRepository.save(user);

    const payload = { sub: user.id, userEmail: user.email };
    const accessToken = await this.generateAccessToken(payload);

    return { accessToken };
  }

  async generateAccessToken(payload: { sub: string; userEmail: string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.AUTH_TOKEN_SECRET,
      expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN,
    });

    return accessToken;
  }
}
