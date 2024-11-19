import { AccommodationCategory } from '../../modules/categories/entities/category.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { accommodationCategories } from '../data/accommodation-categories.data';
import { Logger } from '@nestjs/common';

export class AccommodationCategorySeeder implements Seeder {
  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    const categoryRepository = this.dataSource.getRepository(
      AccommodationCategory,
    );
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.query('TRUNCATE TABLE accommodation_category CASCADE');

    const categories = categoryRepository.create(accommodationCategories);

    await categoryRepository.save(categories);

    Logger.log('Categories seeded successfully');
  }
}
