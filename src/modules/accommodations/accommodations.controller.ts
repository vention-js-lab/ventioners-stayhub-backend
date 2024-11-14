import { Controller, Get, Query } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { SearchAccommodationParamsDto } from './dto/request';
import { GetAccommodationsSwaggerDecorator } from './decorators/swagger.decorator';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Get()
  @GetAccommodationsSwaggerDecorator()
  async getManyAccommodations(
    @Query() searchParams: SearchAccommodationParamsDto,
  ) {
    return await this.accommodationsService.getAccommodations(searchParams);
  }
}
