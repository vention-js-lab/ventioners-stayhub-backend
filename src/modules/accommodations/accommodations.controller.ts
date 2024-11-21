import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { SearchAccommodationQueryParamsDto } from './dto/request';
import { GetAccommodationsSwaggerDecorator } from './decorators/swagger.decorator';
import { CreateAccommodationDto } from './dto/request/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/request/update-accommodatio.dto';

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

  @Post()
  async createAccommodation(@Body() createDto: CreateAccommodationDto) {
    return this.accommodationsService.createAccommodation(createDto);
  }

  @Get(':id')
  async getAccommodationById(@Param('id') id: string) {
    return this.accommodationsService.getAccommodationById(id);
  }

  @Put(':id')
  async updateAccommodation(
    @Param('id') id: string,
    @Body() updateDto: UpdateAccommodationDto,
  ) {
    return this.accommodationsService.updateAccommodation(id, updateDto);
  }

  @Delete(':id')
  async deleteAccommodation(@Param('id') id: string) {
    const accommodation =
      await this.accommodationsService.getAccommodationById(id);
    if (!accommodation) {
      throw new NotFoundException(`Accommodation with ID ${id} not found`);
    }
    return this.accommodationsService.deleteAccommodation(id);
  }
}
