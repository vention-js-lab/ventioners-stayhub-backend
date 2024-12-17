import { MigrationInterface, QueryRunner } from 'typeorm';
import { Amenity } from 'src/modules/amenities/entities';
import { accommodationAmenitiesV2 } from '../data/accommodation-amenities-v2.data';
import { accommodationCategoriesV2 } from '../data/accommodation-categories-v2.data';
import { AccommodationCategory } from 'src/modules/categories/entities';

export class AddRussianColumnsForCategoryAndAmenity1734374876753
  implements MigrationInterface
{
  name = 'AddRussianColumnsForCategoryAndAmenity1734374876753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE accommodation_amenities CASCADE');
    await queryRunner.query('TRUNCATE TABLE amenity CASCADE');
    await queryRunner.query('TRUNCATE TABLE accommodation_category CASCADE');

    await queryRunner.query(
      `ALTER TABLE "amenity" ADD "name_ru" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" ADD CONSTRAINT "UQ_86ae985648e23de50b63d36c525" UNIQUE ("name_ru")`,
    );
    await queryRunner.query(`ALTER TABLE "amenity" ADD "description_ru" text`);
    await queryRunner.query(
      `ALTER TABLE "accommodation_category" ADD "name_ru" character varying(125)`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_category" ADD CONSTRAINT "UQ_f73a602705d2ad4c846860f2f26" UNIQUE ("name_ru")`,
    );

    const categories = accommodationCategoriesV2.map((categoryData) =>
      queryRunner.manager.create(AccommodationCategory, categoryData),
    );

    await queryRunner.manager.save(categories);

    const amenities = accommodationAmenitiesV2.map((amenityData) =>
      queryRunner.manager.create(Amenity, amenityData),
    );

    await queryRunner.manager.save(amenities);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE accommodation_amenities CASCADE');
    await queryRunner.query('TRUNCATE TABLE amenity CASCADE');
    await queryRunner.query('TRUNCATE TABLE accommodation_category CASCADE');
    await queryRunner.query(
      `ALTER TABLE "accommodation_category" DROP CONSTRAINT "UQ_f73a602705d2ad4c846860f2f26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_category" DROP COLUMN "name_ru"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" DROP COLUMN "description_ru"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" DROP CONSTRAINT "UQ_86ae985648e23de50b63d36c525"`,
    );
    await queryRunner.query(`ALTER TABLE "amenity" DROP COLUMN "name_ru"`);
  }
}
