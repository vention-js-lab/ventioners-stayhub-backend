import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayment1733429446726 implements MigrationInterface {
  name = 'CreatePayment1733429446726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payment_status_enum" AS ENUM('PENDING', 'APPROVED', 'FAILED', 'EXPIRED')`,
    );
    await queryRunner.query(`CREATE TABLE "payment"
                             (
                                 "id"         uuid                           NOT NULL DEFAULT uuid_generate_v4(),
                                 "amount"     numeric                        NOT NULL,
                                 "status"     "public"."payment_status_enum" NOT NULL DEFAULT 'PENDING',
                                 "created_at" TIMESTAMP                      NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP                      NOT NULL DEFAULT now(),
                                 "bookingId"  uuid,
                                 CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "payment"
        ADD CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098" FOREIGN KEY ("bookingId") REFERENCES "booking" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098"`,
    );
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
  }
}
