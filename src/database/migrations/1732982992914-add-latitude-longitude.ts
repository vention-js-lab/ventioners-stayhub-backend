import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLatitudeLongitude1732982992914 implements MigrationInterface {
  name = 'AddLatitudeLongitude1732982992914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP COLUMN "location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "location" json NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP COLUMN "location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "location" character varying(200) NOT NULL`,
    );
  }
}
