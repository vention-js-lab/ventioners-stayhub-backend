import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropIconFromAmenityAndAccommodationAndMakeNameUnique1731934120969
  implements MigrationInterface
{
  name = 'DropIconFromAmenityAndAccommodationAndMakeNameUnique1731934120969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "amenity" DROP COLUMN "icon"`);
    await queryRunner.query(
      `ALTER TABLE "accommodation_category" DROP COLUMN "icon"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" ADD CONSTRAINT "UQ_eedf8a09ca6003f9fced4749b7c" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_category" ADD CONSTRAINT "UQ_4855034d9ab83f3d50eeb4df696" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "accommodation_category"`);
    await queryRunner.query(`DELETE FROM "amenity"`);
    await queryRunner.query(
      `ALTER TABLE "accommodation_category" DROP CONSTRAINT "UQ_4855034d9ab83f3d50eeb4df696"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" DROP CONSTRAINT "UQ_eedf8a09ca6003f9fced4749b7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_category" ADD "icon" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenity" ADD "icon" character varying NOT NULL`,
    );
  }
}
