import { MigrationInterface, QueryRunner } from 'typeorm';
import { accommodationCategoriesV2 } from '../data/accommodation-categories-v2.data';
import { AccommodationCategory } from 'src/modules/categories/entities';

export class UpdateOrderAndRussianCategoryNames1734441100250
  implements MigrationInterface
{
  name = 'UpdateOrderAndRussianCategoryNames1734441100250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE accommodation_category CASCADE');

    const categories = accommodationCategoriesV2.map((categoryData) =>
      queryRunner.manager.create(AccommodationCategory, categoryData),
    );

    await queryRunner.manager.save(categories);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE accommodation_category CASCADE');
  }
}
