import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Accommodation } from '../accommodations';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Accommodation, User])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
