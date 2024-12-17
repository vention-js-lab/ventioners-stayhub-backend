import { Hasher } from './../../shared/libs/hasher.lib';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/request/register.dto';
import { UsersRepository } from '../users/users.repository';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/request/login.dto';
import { JwtPayload } from './auth.types';
import { UpdatePasswordDto } from './dto/request/update-password.dto';
import { User } from '../users/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { randomBytes } from 'node:crypto';
import { MailerService } from '../mail/mail.service';
import { VERIFICATION_LINK_EXPIRE_TIME } from 'src/shared/constants';
import { PendingUser } from './types';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name, { timestamp: true });
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly mailService: MailerService,
  ) {}

  private async prepareUserData(createUserDto: RegisterDto) {
    const { email, password, firstName, lastName } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const pendingKey = this.generateVerificationKey(email);
    const existingPendingUser = await this.redisService.get(pendingKey);
    if (existingPendingUser) {
      throw new ConflictException(
        'Verification is already in progress for this email',
      );
    }

    const hashedPassword = await Hasher.hashValue(password);

    const verificationToken = this.generateVerificationToken();

    const pendingUserData: PendingUser = {
      email,
      hashedPassword,
      firstName,
      lastName,
      verificationToken,
    };

    await this.redisService.set(
      pendingKey,
      JSON.stringify(pendingUserData),
      VERIFICATION_LINK_EXPIRE_TIME,
    );

    return verificationToken;
  }

  async registerPendingUser(dto: RegisterDto) {
    const verificationToken = await this.prepareUserData(dto);

    await this.mailService.sendVerificationEmail(
      dto.email,
      dto.firstName,
      verificationToken,
    );

    return {
      message: 'Registration initiated. Please verify your email.',
      email: dto.email,
    };
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
      throw new BadRequestException('Invalid current password');
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

  async verifyAndCreateUser(email: string, token: string) {
    const pendingKey = this.generateVerificationKey(email);
    const pendingUserData = await this.redisService.get(pendingKey);

    if (!pendingUserData || !token) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    const userData = JSON.parse(pendingUserData) as PendingUser;

    if (userData.verificationToken !== token) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    try {
      const newUser = await this.usersRepository.createUser({
        email: userData.email,
        password: userData.hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      await this.redisService.delete(pendingKey);

      const payload = { sub: newUser.id, userEmail: newUser.email };
      const accessToken = await this.generateToken('ACCESS', payload);
      const refreshToken = await this.generateToken('REFRESH', payload);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('User creation failed', error);
      throw new UnauthorizedException('User creation failed');
    }
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

  private generateVerificationKey(email: string) {
    return `pending_user:${email}`;
  }
  private generateVerificationToken() {
    return randomBytes(32).toString('hex');
  }
}
