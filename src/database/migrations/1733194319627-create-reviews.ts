import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReviews1733194319627 implements MigrationInterface {
  name = 'CreateReviews1733194319627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" numeric(2,1) NOT NULL, "comment" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "accommodationId" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_f6e65451444296173e489efbd52" FOREIGN KEY ("accommodationId") REFERENCES "accommodation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_f6e65451444296173e489efbd52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "profile_picture_url"`,
    );
    await queryRunner.query(`DROP TABLE "review"`);
  }
}
