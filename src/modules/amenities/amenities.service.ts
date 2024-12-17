import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Amenity } from './entities';
import { In, Repository } from 'typeorm';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
  ) {}

  async getAllAmenities(acceptLanguage: string = 'en'): Promise<Amenity[]> {
    const amenities = await this.amenityRepository.find();

    return amenities.map((amenity) => ({
      ...amenity,
      name: acceptLanguage === 'ru' ? amenity.name_ru : amenity.name,
      description:
        acceptLanguage === 'ru' ? amenity.description_ru : amenity.description,
    }));
  }

  async getAmenitiesByIds(ids: string[]): Promise<Amenity[]> {
    const amenities = await this.amenityRepository.findBy({
      id: In(ids),
    });

    return amenities;
  }
}
