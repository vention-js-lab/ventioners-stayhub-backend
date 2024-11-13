import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccommodationAmenityCategory1731494096342
  implements MigrationInterface
{
  name = 'CreateAccommodationAmenityCategory1731494096342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "amenity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "icon" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "accommodationId" uuid, CONSTRAINT "PK_f981de7b1a822823e5f31da10dc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "accommodation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(125) NOT NULL, "description" character varying(255) NOT NULL, "images" text array NOT NULL, "location" character varying(200) NOT NULL, "price_per_night" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, CONSTRAINT "PK_2c4c7f0aaccd4ff2238559a617c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "accommodation_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(125) NOT NULL, "icon" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7adc390194cc2ff8fbc42fae59a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" ADD CONSTRAINT "FK_e9f5dae5f3a69f3ac2fd94358aa" FOREIGN KEY ("accommodationId") REFERENCES "accommodation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "amenity" DROP CONSTRAINT "FK_e9f5dae5f3a69f3ac2fd94358aa"`,
    );
    await queryRunner.query(`DROP TABLE "accommodation_category"`);
    await queryRunner.query(`DROP TABLE "accommodation"`);
    await queryRunner.query(`DROP TABLE "amenity"`);
  }
}
