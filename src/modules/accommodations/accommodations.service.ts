import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Accommodation, Wishlist } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LikeAccommodationDto,
  SearchAccommodationQueryParamsDto,
  UpdateAccommodationDto,
  CreateAccommodationDto,
} from './dto/request';
import { PaginatedResult } from './interfaces';
import { User } from '../users/entities/user.entity';
import { AmenitiesService } from '../amenities/amenities.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,

    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly amenitiesService: AmenitiesService,
    private readonly categoryService: CategoriesService,
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

  async createAccommodation(
    createDto: CreateAccommodationDto,
    userId: string,
  ): Promise<Accommodation> {
    const { amenities, categoryId, ...accommodationData } = createDto;
    const allAmenities = await this.amenitiesService.getAllAmenities();
    const resolvedAmenities = amenities
      ? allAmenities.filter((amenity) => amenities.includes(amenity.id))
      : [];

    const allCategories = await this.categoryService.getAllCategories();
    const resolvedCategory = allCategories.find(
      (category) => category.id === categoryId,
    );

    if (!resolvedCategory) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const newAccommodation = this.accommodationRepository.create({
      ...accommodationData,
      amenities: resolvedAmenities,
      category: resolvedCategory,
      user: { id: userId },
    });

    return this.accommodationRepository.save(newAccommodation);
  }

  async getAccommodationById(id: string): Promise<Accommodation> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
      relations: ['amenities', 'category', 'owner'],
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation with ID ${id} not found`);
    }

    return accommodation;
  }

  async updateAccommodation(
    id: string,
    updateDto: UpdateAccommodationDto,
    userId: string,
  ): Promise<Accommodation> {
    const { amenities, categoryId, ...updateData } = updateDto;

    const accommodation = await this.getAccommodationById(id);
    if (accommodation.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this accommodation',
      );
    }
    if (amenities) {
      const allAmenities = await this.amenitiesService.getAllAmenities();
      accommodation.amenities = allAmenities.filter((amenity) =>
        amenities.includes(amenity.id),
      );
    }
    if (categoryId) {
      const allCategories = await this.categoryService.getAllCategories();
      const category = allCategories.find((cat) => cat.id === categoryId);

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      accommodation.category = category;
    }

    Object.assign(accommodation, updateData);

    return this.accommodationRepository.save(accommodation);
  }

  async deleteAccommodation(id: string, userId: string): Promise<void> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    if (accommodation.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this accommodation',
      );
    }
  }

  async toggleLikeAccommodation(
    payload: LikeAccommodationDto,
  ): Promise<boolean> {
    const { userId, accommodationId } = payload;

    const existingLike = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, accommodation: { id: accommodationId } },
    });

    if (existingLike) {
      await this.wishlistRepository.remove(existingLike);
      return false;
    } else {
      const accommodation = await this.accommodationRepository.findOne({
        where: { id: accommodationId },
      });

      if (!accommodation) {
        throw new NotFoundException('Accommodation not found');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });

      const userLike = new Wishlist();
      userLike.user = user;
      userLike.accommodation = accommodation;

      await this.wishlistRepository.save(userLike);
      return true;
    }
  }
}
