import { MigrationInterface, QueryRunner } from 'typeorm';

export class IncreaseDescriptionLimit1734440117675
  implements MigrationInterface
{
  name = 'IncreaseDescriptionLimit1734440117675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" ALTER COLUMN "description" TYPE VARCHAR(2000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" ALTER COLUMN "description" TYPE VARCHAR(255)`,
    );
  }
}
