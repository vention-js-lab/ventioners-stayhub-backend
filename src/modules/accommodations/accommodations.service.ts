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

  async getManyAccommodations(
    searchParams: SearchAccommodationParamsDto,
  ): Promise<PaginatedResult<Accommodation>> {
    const query =
      this.accommodationRepository.createQueryBuilder('accommodation');

    const page = searchParams.page || 1;
    const limit = searchParams.limit || 10;
    const skip = (page - 1) * limit;

    if (searchParams.search) {
      query.andWhere(
        '(accommodation.name ILIKE :search OR accommodation.description ILIKE :search)',
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

    if (searchParams.location) {
      query.andWhere('(accommodation.location ILIKE :location)', {
        location: `%${searchParams.location}%`,
      });
    }

    if (searchParams.fromDate && searchParams.toDate) {
      query.andWhere(
        '(accommodation.createdAt >= :fromDate AND accommodation.createdAt <= :toDate)',
        {
          fromDate: searchParams.fromDate,
          toDate: searchParams.toDate,
        },
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
