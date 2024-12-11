import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities';
import { Repository } from 'typeorm';
import { Accommodation } from '../accommodations';
import { CreateReviewDto } from './dto/request/creare-review.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getReviewsByAccommodationId(accommodationId: string) {
    const accommodation = await this.accommodationRepository.find({
      where: { id: accommodationId },
    });

    if (!accommodation.length) {
      throw new NotFoundException('Accommodation not found with this id');
    }

    return await this.reviewRepository.find({
      where: { accommodation: { id: accommodationId } },
      relations: ['user'],
    });
  }

  async createReview(
    accommodationId: string,
    createReviewDto: CreateReviewDto,
    userId: string,
  ) {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation not found with this id');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found with this id');
    }

    const newReview = this.reviewRepository.create({
      ...createReviewDto,
      accommodation,
      user,
    });

    return await this.reviewRepository.save(newReview);
  }
}
