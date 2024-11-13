import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccommodationAmenityCategory1731498101614
  implements MigrationInterface
{
  name = 'CreateAccommodationAmenityCategory1731498101614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accommodation_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(125) NOT NULL, "icon" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7adc390194cc2ff8fbc42fae59a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "accommodation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(125) NOT NULL, "description" character varying(255) NOT NULL, "images" text array NOT NULL, "location" character varying(200) NOT NULL, "price_per_night" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, CONSTRAINT "PK_2c4c7f0aaccd4ff2238559a617c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "amenity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "icon" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f981de7b1a822823e5f31da10dc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "accommodation_amenities" ("accommodation_id" uuid NOT NULL, "amenity_id" uuid NOT NULL, CONSTRAINT "PK_08af60db59c2237a3d75a9e361a" PRIMARY KEY ("accommodation_id", "amenity_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9772e50509307a66452b7b6717" ON "accommodation_amenities" ("accommodation_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_19503da346fe4377d773b06c7a" ON "accommodation_amenities" ("amenity_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD CONSTRAINT "FK_e71a3463d01c51864de425979cc" FOREIGN KEY ("categoryId") REFERENCES "accommodation_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_amenities" ADD CONSTRAINT "FK_9772e50509307a66452b7b67175" FOREIGN KEY ("accommodation_id") REFERENCES "accommodation"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_amenities" ADD CONSTRAINT "FK_19503da346fe4377d773b06c7a1" FOREIGN KEY ("amenity_id") REFERENCES "amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation_amenities" DROP CONSTRAINT "FK_19503da346fe4377d773b06c7a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_amenities" DROP CONSTRAINT "FK_9772e50509307a66452b7b67175"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP CONSTRAINT "FK_e71a3463d01c51864de425979cc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_19503da346fe4377d773b06c7a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9772e50509307a66452b7b6717"`,
    );
    await queryRunner.query(`DROP TABLE "accommodation_amenities"`);
    await queryRunner.query(`DROP TABLE "amenity"`);
    await queryRunner.query(`DROP TABLE "accommodation"`);
    await queryRunner.query(`DROP TABLE "accommodation_category"`);
  }
}
