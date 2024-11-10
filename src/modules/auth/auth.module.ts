import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN },
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) => new UsersRepository(dataSource),
      inject: [DataSource],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
