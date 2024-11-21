import { Injectable, NotFoundException } from '@nestjs/common';
import { Accommodation } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchAccommodationQueryParamsDto } from './dto/request';
import { PaginatedResult } from './interfaces';
import { CreateAccommodationDto } from './dto/request/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/request/update-accommodatio.dto';
import { AmenitiesService } from '../amenities/amenities.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
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

    query.innerJoinAndSelect('accommodation.owner', 'owner');

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
  ): Promise<Accommodation> {
    const { amenities, categoryId, ...accommodationData } = createDto;
    console.log(createDto);
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
  ): Promise<Accommodation> {
    const { amenities, categoryId, ...updateData } = updateDto;

    const accommodation = await this.getAccommodationById(id);
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

  async deleteAccommodation(id: string): Promise<void> {
    await this.accommodationRepository.delete(id);
  }
}
