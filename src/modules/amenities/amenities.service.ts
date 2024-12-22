import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Amenity } from './entities';
import { In, Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { parseJSON } from 'src/shared/helpers';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
    private readonly redisService: RedisService,
  ) {}

  private readonly logger = new Logger('AmenitiesService');

  async getAllAmenities(acceptLanguage: string = 'en'): Promise<Amenity[]> {
    const cacheKey = `amenities:${acceptLanguage}`;
    const cachedAmenities = await this.redisService.get(cacheKey);

    if (cachedAmenities) {
      const amenities = parseJSON<Amenity[]>(cachedAmenities);

      if (Array.isArray(amenities)) {
        this.logger.log(`Cache hit: ${cacheKey}`);

        return amenities;
      }
    }

    const amenities = await this.amenityRepository.find();

    const localizedAmenities = amenities.map((amenity) => ({
      ...amenity,
      name: acceptLanguage === 'ru' ? amenity.name_ru : amenity.name,
      description:
        acceptLanguage === 'ru' ? amenity.description_ru : amenity.description,
    }));

    await this.redisService.set(
      cacheKey,
      JSON.stringify(localizedAmenities),
      5 * 24 * 60 * 60,
    );

    return localizedAmenities;
  }

  async getAmenitiesByIds(ids: string[]): Promise<Amenity[]> {
    const amenities = await this.amenityRepository.findBy({
      id: In(ids),
    });

    return amenities;
  }
}
