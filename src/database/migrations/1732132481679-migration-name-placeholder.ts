import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserLikeAccommodation1732132481679 implements MigrationInterface {
  name = 'UserLikeAccommodation1732132481679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" DROP CONSTRAINT "FK_accommodation_like_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" DROP CONSTRAINT "FK_accommodation_like_accommodation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" DROP CONSTRAINT "UQ_accommodation_user_unique"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" ADD CONSTRAINT "UQ_fcdabe6b8803a7ed04489e2566a" UNIQUE ("userId", "accommodationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" ADD CONSTRAINT "FK_344a234b366f31a55fe114077f2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" ADD CONSTRAINT "FK_51f5fed4a3e043acd063286bffb" FOREIGN KEY ("accommodationId") REFERENCES "accommodation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" DROP CONSTRAINT "FK_51f5fed4a3e043acd063286bffb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" DROP CONSTRAINT "FK_344a234b366f31a55fe114077f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" DROP CONSTRAINT "UQ_fcdabe6b8803a7ed04489e2566a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" ADD CONSTRAINT "UQ_accommodation_user_unique" UNIQUE ("accommodationId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" ADD CONSTRAINT "FK_accommodation_like_accommodation" FOREIGN KEY ("accommodationId") REFERENCES "accommodation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accommodation_like" ADD CONSTRAINT "FK_accommodation_like_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
