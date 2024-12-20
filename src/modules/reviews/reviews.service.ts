import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities';
import { Repository } from 'typeorm';
import { Accommodation } from '../accommodations';
import { CreateReviewDto } from './dto/request/creare-review.dto';
import { UsersService } from '../users/users.service';
import { AccommodationsService } from '../accommodations/accommodations.service';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
    private readonly userService: UsersService,
    private readonly accommodatioService: AccommodationsService,
    private readonly bookingService: BookingsService,
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

  async createReview(createReviewDto: CreateReviewDto, userId: string) {
    const accommodation = await this.accommodatioService.getAccommodationById(
      createReviewDto.accommodationId,
    );

    const user = await this.userService.getUser(userId);

    const userBookings = await this.bookingService.getMyBookings({}, userId);
    const userHasBooking = userBookings.length > 0;

    if (!userHasBooking) {
      throw new ForbiddenException('You must have a booking to leave a review');
    }

    const newReview = this.reviewRepository.create({
      ...createReviewDto,
      accommodation,
      user,
    });

    return await this.reviewRepository.save(newReview);
  }
}
