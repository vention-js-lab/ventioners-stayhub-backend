import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('AUTH_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('AUTH_ACCESS_TOKEN_EXPIRES_IN'),
        },
      }),
    }),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [
    JwtAuthGuard,
    ConfigService,
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) => new UsersRepository(dataSource),
      inject: [DataSource],
    },
    UsersService,
  ],
  exports: [UsersRepository, JwtAuthGuard],
})
export class UsersModule {}
