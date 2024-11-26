import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { SearchAccommodationQueryParamsDto } from './dto/request';
import { GetAccommodationsSwaggerDecorator } from './decorators/swagger.decorator';
import { GetUser } from 'src/shared/decorators';
import { AuthTokenGuard } from 'src/shared/guards';
import { User } from '../users/entities/user.entity';

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

  @Post(':id/wishlist')
  @UseGuards(AuthTokenGuard)
  async toggleWishlistAccommodation(
    @Param('id') accommodationId: string,
    @GetUser() user: User,
  ) {
    await this.accommodationsService.toggleWishlistAccommodation({
      accommodationId,
      userId: user.id,
    });
  }
}
