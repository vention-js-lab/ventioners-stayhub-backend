import { Amenity } from 'src/modules/amenities/entities';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { accommodationAmenities } from '../data/accommodation-amenities.data';
import { Logger } from '@nestjs/common';

export class AccommodationAmenitySeeder implements Seeder {
  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    const amenityRepository = this.dataSource.getRepository(Amenity);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.query('TRUNCATE TABLE accommodation_amenities CASCADE');

    await queryRunner.query('TRUNCATE TABLE amenity CASCADE');

    const amenities = amenityRepository.create(accommodationAmenities);

    await amenityRepository.save(amenities);

    Logger.log('Amenities seeded successfully');
  }
}
