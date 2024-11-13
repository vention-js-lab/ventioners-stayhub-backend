import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccommodationAmenityCategory1731485768720
  implements MigrationInterface
{
  name = 'CreateAccommodationAmenityCategory1731485768720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accommodation_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(125) NOT NULL, "icon" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7adc390194cc2ff8fbc42fae59a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accommodation_type_enum" AS ENUM('hotel', 'apartment', 'villa', 'resort', 'hostel', 'guest_house', 'cottage', 'camping')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accommodation_status_enum" AS ENUM('vacant', 'occupied', 'reserved', 'pending_checkout', 'under_maintenance', 'pending_approval', 'blocked', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "accommodation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(125) NOT NULL, "description" character varying(255) NOT NULL, "location" character varying(200) NOT NULL, "price_per_night" numeric NOT NULL, "type" "public"."accommodation_type_enum" NOT NULL, "status" "public"."accommodation_status_enum" NOT NULL DEFAULT 'pending_approval', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, CONSTRAINT "PK_2c4c7f0aaccd4ff2238559a617c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3048b9aa316a36a2011e119503" ON "accommodation" ("type") `,
    );
    await queryRunner.query(
      `CREATE TABLE "amenity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "icon" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "accommodationId" uuid, CONSTRAINT "PK_f981de7b1a822823e5f31da10dc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD CONSTRAINT "FK_e71a3463d01c51864de425979cc" FOREIGN KEY ("categoryId") REFERENCES "accommodation_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" ADD CONSTRAINT "FK_e9f5dae5f3a69f3ac2fd94358aa" FOREIGN KEY ("accommodationId") REFERENCES "accommodation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "amenity" DROP CONSTRAINT "FK_e9f5dae5f3a69f3ac2fd94358aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP CONSTRAINT "FK_e71a3463d01c51864de425979cc"`,
    );
    await queryRunner.query(`DROP TABLE "amenity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3048b9aa316a36a2011e119503"`,
    );
    await queryRunner.query(`DROP TABLE "accommodation"`);
    await queryRunner.query(`DROP TYPE "public"."accommodation_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."accommodation_type_enum"`);
    await queryRunner.query(`DROP TABLE "accommodation_category"`);
  }
}
