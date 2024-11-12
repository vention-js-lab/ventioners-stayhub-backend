import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccommodationAndAmenity1731416768145
  implements MigrationInterface
{
  name = 'CreateAccommodationAndAmenity1731416768145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."accommodation_categories_enum" AS ENUM('hotel', 'apartment', 'villa', 'resort', 'hostel', 'guest_house', 'cottage', 'camping')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accommodation_status_enum" AS ENUM('vacant', 'occupied', 'reserved', 'pending_checkout', 'under_maintenance', 'pending_approval', 'blocked', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "accommodation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(125) NOT NULL, "description" character varying(255) NOT NULL, "location" character varying(200) NOT NULL, "price_per_night" numeric NOT NULL, "categories" "public"."accommodation_categories_enum" array NOT NULL DEFAULT '{hotel}', "status" "public"."accommodation_status_enum" NOT NULL DEFAULT 'pending_approval', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2c4c7f0aaccd4ff2238559a617c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."amenity_category_enum" AS ENUM('essential', 'features', 'location', 'safety', 'kitchen', 'bathroom', 'bedroom', 'entertainment', 'outdoor', 'parking', 'services')`,
    );
    await queryRunner.query(
      `CREATE TABLE "amenity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "category" "public"."amenity_category_enum" NOT NULL DEFAULT 'features', "icon" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "accommodationId" uuid, CONSTRAINT "PK_f981de7b1a822823e5f31da10dc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" ADD CONSTRAINT "FK_e9f5dae5f3a69f3ac2fd94358aa" FOREIGN KEY ("accommodationId") REFERENCES "accommodation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "amenity" DROP CONSTRAINT "FK_e9f5dae5f3a69f3ac2fd94358aa"`,
    );
    await queryRunner.query(`DROP TABLE "amenity"`);
    await queryRunner.query(`DROP TYPE "public"."amenity_category_enum"`);
    await queryRunner.query(`DROP TABLE "accommodation"`);
    await queryRunner.query(`DROP TYPE "public"."accommodation_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."accommodation_categories_enum"`,
    );
  }
}
