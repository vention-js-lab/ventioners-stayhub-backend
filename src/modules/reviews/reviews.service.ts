import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities';
import { Repository } from 'typeorm';
import { Accommodation } from '../accommodations';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
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
    });
  }
}
