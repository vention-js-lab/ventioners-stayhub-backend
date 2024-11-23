import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccommodationOwner1732227911346 implements MigrationInterface {
  name = 'AddAccommodationOwner1732227911346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "accommodation" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD CONSTRAINT "FK_c91ce0c30fb47def102a94aa17d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP CONSTRAINT "FK_c91ce0c30fb47def102a94aa17d"`,
    );
    await queryRunner.query(`ALTER TABLE "accommodation" DROP COLUMN "userId"`);
  }
}
