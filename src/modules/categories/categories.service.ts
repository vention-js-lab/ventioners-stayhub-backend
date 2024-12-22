import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccommodationCategory } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { parseJSON } from 'src/shared/helpers';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(AccommodationCategory)
    private readonly categoriesRepository: Repository<AccommodationCategory>,
    private readonly redisService: RedisService,
  ) {}
  private readonly logger = new Logger('CategoriesService');

  async getAllCategories(): Promise<AccommodationCategory[]> {
    const cachedCategories = await this.redisService.get('categories');

    if (cachedCategories) {
      const categories = parseJSON<AccommodationCategory[]>(cachedCategories);

      if (Array.isArray(categories)) {
        this.logger.log("Cache hit: 'categories'");

        return categories;
      }
    }

    const categories = await this.categoriesRepository.find();

    await this.redisService.set(
      'categories',
      JSON.stringify(categories),
      5 * 24 * 60 * 60,
    );

    return categories;
  }

  async getCategoryById(id: string): Promise<AccommodationCategory> {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    return category;
  }
}
