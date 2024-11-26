import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImage1732571561419 implements MigrationInterface {
  name = 'CreateImage1732571561419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "order" integer NOT NULL DEFAULT '0', "accommodationId" uuid, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "accommodation" DROP COLUMN "images"`);
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_97ca39848384f5407ab7608c796" FOREIGN KEY ("accommodationId") REFERENCES "accommodation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_97ca39848384f5407ab7608c796"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "images" text array NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "image"`);
  }
}
