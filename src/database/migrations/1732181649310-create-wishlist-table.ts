import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWishlist1732181649310 implements MigrationInterface {
  name = 'CreateWishlist1732181649310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wishlist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "liked_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "accommodationId" uuid, CONSTRAINT "UQ_214988a8159f9a355292594130f" UNIQUE ("userId", "accommodationId"), CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_f6eeb74a295e2aad03b76b0ba87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_f7fa11a5f81ddfbea9ab33db66b" FOREIGN KEY ("accommodationId") REFERENCES "accommodation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_f7fa11a5f81ddfbea9ab33db66b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_f6eeb74a295e2aad03b76b0ba87"`,
    );
    await queryRunner.query(`DROP TABLE "wishlist"`);
  }
}
