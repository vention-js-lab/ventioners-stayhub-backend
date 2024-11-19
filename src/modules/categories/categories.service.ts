import { Injectable } from '@nestjs/common';
import { AccommodationCategory } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(AccommodationCategory)
    private readonly categoriesRepository: Repository<AccommodationCategory>,
  ) {}

  async getAllCategories(): Promise<AccommodationCategory[]> {
    return await this.categoriesRepository.find();
  }
}
