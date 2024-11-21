import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { SearchAccommodationQueryParamsDto } from './dto/request';
import {
  CreateAccommodationSwaggerDecorator,
  DeleteAccommodationSwaggerDecorator,
  GetAccommodationsSwaggerDecorator,
  GetByIdSwaggerDecorator,
  UpdateAccommodationSwaggerDecorator,
} from './decorators/swagger.decorator';
import { CreateAccommodationDto } from './dto/request/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/request/update-accommodation.dto';
import { ApiTags } from '@nestjs/swagger';
import { ParseUUIDV4Pipe } from 'src/shared/pipes';

@Controller('accommodations')
@ApiTags('Accommodation')
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
  @CreateAccommodationSwaggerDecorator()
  async createAccommodation(@Body() createDto: CreateAccommodationDto) {
    const newAccommodation =
      this.accommodationsService.createAccommodation(createDto);
    return { data: newAccommodation };
  }

  @Get(':id')
  @GetByIdSwaggerDecorator()
  async getAccommodationById(@Param('id', ParseUUIDV4Pipe) id: string) {
    const accommodationData =
      this.accommodationsService.getAccommodationById(id);
    return { data: accommodationData };
  }

  @Put(':id')
  @UpdateAccommodationSwaggerDecorator()
  async updateAccommodation(
    @Param('id', ParseUUIDV4Pipe) id: string,
    @Body() updateDto: UpdateAccommodationDto,
  ) {
    const updatedData = this.accommodationsService.updateAccommodation(
      id,
      updateDto,
    );
    return { data: updatedData };
  }

  @Delete(':id')
  @DeleteAccommodationSwaggerDecorator()
  async deleteAccommodation(@Param('id', ParseUUIDV4Pipe) id: string) {
    const deletedAccommodation =
      await this.accommodationsService.getAccommodationById(id);
    return { data: deletedAccommodation };
  }
}
