import { Injectable, NotFoundException } from '@nestjs/common';
import { Accommodation, Wishlist } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  WishlistAccommodationDto,
  SearchAccommodationQueryParamsDto,
} from './dto/request';
import { PaginatedResult } from './interfaces';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,

    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAccommodations(
    searchParams: SearchAccommodationQueryParamsDto,
  ): Promise<PaginatedResult<Accommodation>> {
    const query =
      this.accommodationRepository.createQueryBuilder('accommodation');

    const page = searchParams.page || 1;
    const limit = searchParams.limit || 10;
    const skip = (page - 1) * limit;

    if (searchParams.search) {
      query.andWhere(
        '(accommodation.name ILIKE :search OR accommodation.description ILIKE :search OR accommodation.location ILIKE :search)',
        { search: `%${searchParams.search}%` },
      );
    }

    if (searchParams.categoryId) {
      query.innerJoinAndSelect(
        'accommodation.category',
        'category',
        'category.id = :categoryId',
        { categoryId: searchParams.categoryId },
      );
    }

    const totalCount = await query.getCount();

    query.skip(skip).take(limit);

    const items = await query.getMany();

    return {
      items,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async toggleWishlistAccommodation(
    payload: WishlistAccommodationDto,
  ): Promise<boolean> {
    const { userId, accommodationId } = payload;

    const isInWishlist = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, accommodation: { id: accommodationId } },
    });

    if (isInWishlist) {
      await this.wishlistRepository.remove(isInWishlist);
      return false;
    } else {
      const accommodation = await this.accommodationRepository.findOne({
        where: { id: accommodationId },
      });

      if (!accommodation) {
        throw new NotFoundException('Accommodation not found');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });

      const userWishlist = new Wishlist();
      userWishlist.user = user;
      userWishlist.accommodation = accommodation;

      await this.wishlistRepository.save(userWishlist);
      return true;
    }
  }
}
