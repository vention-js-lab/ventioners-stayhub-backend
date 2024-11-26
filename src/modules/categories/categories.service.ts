import { Injectable, NotFoundException } from '@nestjs/common';
import { AccommodationCategory } from './entities';
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

  async getCategoryById(id: string): Promise<AccommodationCategory> {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    return category;
  }
}
