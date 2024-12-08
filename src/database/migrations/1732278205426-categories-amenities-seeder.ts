import { MigrationInterface, QueryRunner } from 'typeorm';
import { accommodationAmenities } from '../data/accommodation-amenities.data';
import { Amenity } from 'src/modules/amenities/entities';
import { accommodationCategories } from '../data/accommodation-categories.data';
import { AccommodationCategory } from 'src/modules/categories/entities';

export class CategoriesAndAmenitiesSeeder1732278205426
  implements MigrationInterface
{
  name = 'CategoriesAndAmenitiesSeeder1732278205426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE accommodation_amenities CASCADE');
    await queryRunner.query('TRUNCATE TABLE amenity CASCADE');
    await queryRunner.query('TRUNCATE TABLE accommodation_category CASCADE');

    const categories = accommodationCategories.map((categoryData) =>
      queryRunner.manager.create(AccommodationCategory, categoryData),
    );

    await queryRunner.manager.save(categories);

    const amenities = accommodationAmenities.map((amenityData) =>
      queryRunner.manager.create(Amenity, amenityData),
    );

    await queryRunner.manager.save(amenities);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE accommodation_amenities CASCADE');
    await queryRunner.query('TRUNCATE TABLE amenity CASCADE');
    await queryRunner.query('TRUNCATE TABLE accommodation_category CASCADE');
  }
}
