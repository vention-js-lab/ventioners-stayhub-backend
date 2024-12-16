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

  async getAllAmenities(acceptLanguage: string): Promise<Amenity[]> {
    const amenities = await this.amenityRepository.find();

    return amenities.map((amenity) => ({
      ...amenity,
      name: acceptLanguage === 'en' ? amenity.name : amenity.name_ru,
      description:
        acceptLanguage === 'en' ? amenity.description : amenity.description_ru,
    }));
  }

  async getAmenitiesByIds(ids: string[]): Promise<Amenity[]> {
    const amenities = await this.amenityRepository.findBy({
      id: In(ids),
    });

    return amenities;
  }
}
