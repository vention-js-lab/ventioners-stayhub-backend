import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { DataSource } from 'typeorm';
import { Wishlist } from '../accommodations';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User])],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) => new UsersRepository(dataSource),
      inject: [DataSource],
    },
    UsersService,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
