import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfilePictureToUser1732909315405
  implements MigrationInterface
{
  name = 'AddProfilePictureToUser1732909315405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profile_picture_url" character varying(2048)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "profile_picture_url"`,
    );
  }
}
