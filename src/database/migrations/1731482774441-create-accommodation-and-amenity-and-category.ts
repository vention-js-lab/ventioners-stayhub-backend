import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccommodatonAndAmenityAndCategory1731482774441
  implements MigrationInterface
{
  name = 'CreateAccommodatonAndAmenityAndCategory1731482774441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accommodation_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(125) NOT NULL, "icon" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7adc390194cc2ff8fbc42fae59a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP COLUMN "categories"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."accommodation_categories_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "amenity" DROP COLUMN "category"`);
    await queryRunner.query(`DROP TYPE "public"."amenity_category_enum"`);
    await queryRunner.query(
      `CREATE TYPE "public"."accommodation_type_enum" AS ENUM('hotel', 'apartment', 'villa', 'resort', 'hostel', 'guest_house', 'cottage', 'camping')`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "type" "public"."accommodation_type_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "categoryId" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3048b9aa316a36a2011e119503" ON "accommodation" ("type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD CONSTRAINT "FK_e71a3463d01c51864de425979cc" FOREIGN KEY ("categoryId") REFERENCES "accommodation_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP CONSTRAINT "FK_e71a3463d01c51864de425979cc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3048b9aa316a36a2011e119503"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(`ALTER TABLE "accommodation" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."accommodation_type_enum"`);
    await queryRunner.query(
      `CREATE TYPE "public"."amenity_category_enum" AS ENUM('essential', 'features', 'location', 'safety', 'kitchen', 'bathroom', 'bedroom', 'entertainment', 'outdoor', 'parking', 'services')`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" ADD "category" "public"."amenity_category_enum" NOT NULL DEFAULT 'features'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accommodation_categories_enum" AS ENUM('hotel', 'apartment', 'villa', 'resort', 'hostel', 'guest_house', 'cottage', 'camping')`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "categories" "public"."accommodation_categories_enum" array NOT NULL DEFAULT '{hotel}'`,
    );
    await queryRunner.query(`DROP TABLE "accommodation_category"`);
  }
}
