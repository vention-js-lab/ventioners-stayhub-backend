import { Controller, Get } from '@nestjs/common';
import { GetAmenitiesSwaggerDecorator } from './decorators/swagger.decorator';
import { AmenitiesService } from './amenities.service';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Get('')
  @GetAmenitiesSwaggerDecorator()
  async getAllAmenities() {
    const amenities = await this.amenitiesService.getAllAmenities();

    return {
      data: amenities,
    };
  }
}
