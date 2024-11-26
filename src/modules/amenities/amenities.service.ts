import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Amenity } from './entities';
import { In, Repository } from 'typeorm';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
  ) {}

  async getAllAmenities(): Promise<Amenity[]> {
    return this.amenityRepository.find();
  }

  async getAmenitiesByIds(ids: string[]): Promise<Amenity[]> {
    const amenities = await this.amenityRepository.findBy({
      id: In(ids),
    });

    if (amenities.length !== ids.length) {
      const validIds = amenities.map((amenity) => amenity.id);
      const invalidIds = ids.filter((id) => !validIds.includes(id));
      throw new NotFoundException(
        `Amenity with ID(s) ${invalidIds.join(', ')} not found.`,
      );
    }

    return amenities;
  }
}
