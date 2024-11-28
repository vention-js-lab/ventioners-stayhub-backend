import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserToOwner1732720386302 implements MigrationInterface {
  name = 'ChangeUserToOwner1732720386302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP CONSTRAINT "FK_c91ce0c30fb47def102a94aa17d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" RENAME COLUMN "userId" TO "ownerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD CONSTRAINT "FK_eab3c7cb1718caeb99432db9b7d" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP CONSTRAINT "FK_eab3c7cb1718caeb99432db9b7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" RENAME COLUMN "ownerId" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD CONSTRAINT "FK_c91ce0c30fb47def102a94aa17d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
