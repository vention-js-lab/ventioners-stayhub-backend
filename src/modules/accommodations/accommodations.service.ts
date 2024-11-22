import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Accommodation, Wishlist } from './entities';
import { In, Repository } from 'typeorm';
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
import { Amenity } from '../amenities/entities';
import { AccommodationCategory } from '../categories/entities';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,

    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,

    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AccommodationCategory)
    private readonly categoryRepository: Repository<AccommodationCategory>,
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
    const resolvedAmenities = amenities?.length
      ? await this.amenityRepository.findBy({ id: In(amenities) })
      : [];

    const resolvedCategory = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!resolvedCategory) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    console.log(resolvedCategory + '-' + resolvedAmenities);
    const newAccommodation = await this.accommodationRepository.create({
      ...accommodationData,
      amenities: resolvedAmenities,
      category: resolvedCategory,
      user: { id: userId },
    });

    return await this.accommodationRepository.save(newAccommodation);
  }

  async getAccommodationById(id: string): Promise<Accommodation> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
      relations: ['amenities', 'category', 'user'],
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
      throw new UnauthorizedException('Access denied.');
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

    return await this.accommodationRepository.save(accommodation);
  }

  async deleteAccommodation(id: string, userId: string): Promise<void> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!accommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    if (accommodation.user.id !== userId) {
      throw new UnauthorizedException('Access denied.');
    }

    const deletedAccommodation = await this.accommodationRepository.delete(id);
    if (deletedAccommodation.affected === 0) {
      throw new NotFoundException(`User with id ${userId} not found`);
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
