import { Controller, Get, Query } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { SearchAccommodationQueryParamsDto } from './dto/request';
import { GetAccommodationsSwaggerDecorator } from './decorators/swagger.decorator';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Get()
  @GetAccommodationsSwaggerDecorator()
  async getManyAccommodations(
    @Query() searchQueryParams: SearchAccommodationQueryParamsDto,
  ) {
    const responseData =
      await this.accommodationsService.getAccommodations(searchQueryParams);

    return {
      data: responseData.items,
      totalCount: responseData.totalCount,
      totalPages: responseData.totalPages,
      page: searchQueryParams.page,
      limit: searchQueryParams.limit,
    };
  }
}
