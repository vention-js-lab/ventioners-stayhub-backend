import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThumbnailUrlAndBlurHash1733677537127
  implements MigrationInterface
{
  name = 'AddThumbnailUrlAndBlurHash1733677537127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" ADD "thumbnailUrl" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD "blurhash" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "blurhash"`);
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "thumbnailUrl"`);
  }
}
