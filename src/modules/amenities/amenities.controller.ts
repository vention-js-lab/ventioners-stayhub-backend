import { Controller, Get, Headers } from '@nestjs/common';
import { GetAmenitiesSwaggerDecorator } from './decorators/swagger.decorator';
import { AmenitiesService } from './amenities.service';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Get('')
  @GetAmenitiesSwaggerDecorator()
  async getAllAmenities(@Headers('accept-language') acceptLanguage: string) {
    const amenities =
      await this.amenitiesService.getAllAmenities(acceptLanguage);

    return {
      data: amenities,
    };
  }
}
