import { DataSource } from 'typeorm';
import { AccommodationCategorySeeder } from './seeders/accommodation-category.seeder';
import { AccommodationAmenitySeeder } from './seeders/accommodation-amenity.seeder';
import { Logger } from '@nestjs/common';
import { dataSourceConfig } from 'src/shared/configs/data-source.config';
import {
  Accommodation,
  AccommodationCategory,
  Amenity,
} from 'src/modules/accommodations/entities';
import { User } from 'src/modules/users/entities/user.entity';

export class MainSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async execute() {
    await this.dataSource.initialize();

    const seeders = [
      new AccommodationCategorySeeder(this.dataSource),
      new AccommodationAmenitySeeder(this.dataSource),
    ];

    for (const seeder of seeders) {
      await seeder.run();
    }

    Logger.log('All seeds completed successfully');
  }
}

const mainSeeder = new MainSeeder(
  new DataSource({
    ...dataSourceConfig,
    entities: [AccommodationCategory, Amenity, Accommodation, User],
    logging: true,
  }),
);

(async function () {
  await mainSeeder.execute();
  Logger.log('Seeding completed');
  process.exit(0);
})();
