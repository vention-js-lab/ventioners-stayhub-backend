import { Injectable } from '@nestjs/common';
import { Accommodation } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchAccommodationParamsDto } from './dto/request';
import { PaginatedResult } from './interfaces';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
  ) {}

  async getAccommodations(
    searchParams: SearchAccommodationParamsDto,
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

    if (searchParams.category) {
      query.innerJoinAndSelect(
        'accommodation.category',
        'category',
        'category.id = :categoryId',
        { categoryId: searchParams.category },
      );
    }

    const total = await query.getCount();

    query.skip(skip).take(limit);

    const items = await query.getMany();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
