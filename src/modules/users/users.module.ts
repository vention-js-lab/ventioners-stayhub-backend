import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { DataSource } from 'typeorm';
import { Accommodation, Wishlist } from '../accommodations';
import { User } from './entities/user.entity';
import { MinioModule } from '../minio/minio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accommodation, Wishlist, User]),
    MinioModule,
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) => new UsersRepository(dataSource),
      inject: [DataSource],
    },
    UsersService,
  ],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
