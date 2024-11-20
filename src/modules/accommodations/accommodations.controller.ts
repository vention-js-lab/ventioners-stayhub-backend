import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { SearchAccommodationQueryParamsDto } from './dto/request';
import { GetAccommodationsSwaggerDecorator } from './decorators/swagger.decorator';
import { RefreshTokenGuard } from '../auth/guards';
import { GetUser } from 'src/shared/decorators';
import { JwtPayload } from '../auth/auth.types';

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

  @Post(':id/like')
  @UseGuards(RefreshTokenGuard)
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
