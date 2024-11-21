import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import {
  SearchAccommodationQueryParamsDto,
  CreateAccommodationDto,
  UpdateAccommodationDto,
} from './dto/request';
import {
  CreateAccommodationSwaggerDecorator,
  DeleteAccommodationSwaggerDecorator,
  GetAccommodationsSwaggerDecorator,
  GetByIdSwaggerDecorator,
  UpdateAccommodationSwaggerDecorator,
} from './decorators/swagger.decorator';
import { GetUser } from 'src/shared/decorators';
import { JwtPayload } from '../auth/auth.types';
import { AuthTokenGuard } from 'src/shared/guards';
import { ParseUUIDV4Pipe } from 'src/shared/pipes';

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
  @CreateAccommodationSwaggerDecorator()
  @UseGuards(AuthTokenGuard)
  async createAccommodation(
    @Body() createDto: CreateAccommodationDto,
    @GetUser() payload: JwtPayload,
  ) {
    const newAccommodation = this.accommodationsService.createAccommodation(
      createDto,
      payload.sub,
    );
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
  @UseGuards(AuthTokenGuard)
  async updateAccommodation(
    @Param('id', ParseUUIDV4Pipe) id: string,
    @Body() updateDto: UpdateAccommodationDto,
    @GetUser() payload: JwtPayload,
  ) {
    const updatedData = this.accommodationsService.updateAccommodation(
      id,
      updateDto,
      payload.sub,
    );
    return { data: updatedData };
  }

  @Delete(':id')
  @DeleteAccommodationSwaggerDecorator()
  @HttpCode(204)
  @UseGuards(AuthTokenGuard)
  async deleteAccommodation(
    @Param('id', ParseUUIDV4Pipe) id: string,
    @GetUser() payload: JwtPayload,
  ) {
    return await this.accommodationsService.deleteAccommodation(
      id,
      payload.sub,
    );
  }

  @Post(':id/like')
  @UseGuards(AuthTokenGuard)
  async toggleLikeAccommodation(
    @Param('id') accommodationId: string,
    @GetUser() payload: JwtPayload,
  ) {
    const result = await this.accommodationsService.toggleLikeAccommodation({
      accommodationId,
      userId: payload.sub,
    });

    return { message: result ? 'Liked' : 'Unliked' };
  }
}
