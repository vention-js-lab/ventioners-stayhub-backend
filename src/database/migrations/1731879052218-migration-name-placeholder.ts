import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationNamePlaceholder1731879052218
  implements MigrationInterface
{
  name = 'MigrationNamePlaceholder1731879052218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "wishlist" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "wishlist"`);
  }
}
