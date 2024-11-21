import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Amenity } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
  ) {}

  async getAllAmenities(): Promise<Amenity[]> {
    return this.amenityRepository.find();
  }
}
