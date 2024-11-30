import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLongitudeLatitude1732997200697
  implements MigrationInterface
{
  name = 'CreateLongitudeLatitude1732997200697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" ADD "locationCoordinates" geography(Point,4326) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodation" DROP COLUMN "locationCoordinates"`,
    );
  }
}
