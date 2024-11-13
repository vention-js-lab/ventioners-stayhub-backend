import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccommodationAndAmenity1731480751029
  implements MigrationInterface
{
  name = 'CreateAccommodationAndAmenity1731480751029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" RENAME COLUMN "categories" TO "category"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."accommodation_categories_enum" RENAME TO "accommodation_category_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "amenity" DROP COLUMN "category"`);
    await queryRunner.query(`DROP TYPE "public"."amenity_category_enum"`);
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP COLUMN "category"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accommodation_category_enum" AS ENUM('hotel', 'apartment', 'villa', 'resort', 'hostel', 'guest_house', 'cottage', 'camping')`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "category" "public"."accommodation_category_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e195e953a4788f6a528ede077f" ON "accommodation" ("category") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e195e953a4788f6a528ede077f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP COLUMN "category"`,
    );
    await queryRunner.query(`DROP TYPE "public"."accommodation_category_enum"`);
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "category" "public"."accommodation_category_enum" array NOT NULL DEFAULT '{hotel}'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."amenity_category_enum" AS ENUM('essential', 'features', 'location', 'safety', 'kitchen', 'bathroom', 'bedroom', 'entertainment', 'outdoor', 'parking', 'services')`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" ADD "category" "public"."amenity_category_enum" NOT NULL DEFAULT 'features'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."accommodation_category_enum" RENAME TO "accommodation_categories_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" RENAME COLUMN "category" TO "categories"`,
    );
  }
}
