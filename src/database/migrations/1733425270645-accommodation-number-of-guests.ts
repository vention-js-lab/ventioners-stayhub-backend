import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccommodationNumberOfGuests1733425270645
  implements MigrationInterface
{
  name = 'AccommodationNumberOfGuests1733425270645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "number_of_guests" smallint NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP COLUMN "number_of_guests"`,
    );
  }
}
