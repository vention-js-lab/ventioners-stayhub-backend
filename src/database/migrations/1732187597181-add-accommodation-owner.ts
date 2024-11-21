import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationNamePlaceholder1732187597181
  implements MigrationInterface
{
  name = 'AddAccommodationOwner1732187597181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "ownerId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD CONSTRAINT "FK_eab3c7cb1718caeb99432db9b7d" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP CONSTRAINT "FK_eab3c7cb1718caeb99432db9b7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP COLUMN "ownerId"`,
    );
  }
}
