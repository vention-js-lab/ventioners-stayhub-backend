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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
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
import { AuthTokenGuard } from 'src/shared/guards';
import { User } from '../users/entities/user.entity';
import { ParseUUIDV4Pipe } from 'src/shared/pipes';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthTokenGuard)
  async createAccommodation(
    @Body() createDto: CreateAccommodationDto,
    @GetUser() payload: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const newAccommodation =
      await this.accommodationsService.createAccommodation(
        createDto,
        payload.id,
      );
    const newImage = await this.accommodationsService.addImagesToAccommodation(
      newAccommodation.id,
      files,
      payload.id,
    );
    return { data: newAccommodation, newImage };
  }

  @Get(':id')
  @GetByIdSwaggerDecorator()
  async getAccommodationById(@Param('id', new ParseUUIDV4Pipe()) id: string) {
    const accommodationData =
      await this.accommodationsService.getAccommodationById(id);
    return { data: accommodationData };
  }

  @Put(':id')
  @UpdateAccommodationSwaggerDecorator()
  @UseGuards(AuthTokenGuard)
  async updateAccommodation(
    @Param('id', new ParseUUIDV4Pipe()) id: string,
    @Body() updateDto: UpdateAccommodationDto,
    @GetUser() payload: User,
  ) {
    const updatedData = await this.accommodationsService.updateAccommodation(
      id,
      updateDto,
      payload.id,
    );
    return { data: updatedData };
  }

  @Delete(':id')
  @DeleteAccommodationSwaggerDecorator()
  @HttpCode(204)
  @UseGuards(AuthTokenGuard)
  async deleteAccommodation(
    @Param('id', new ParseUUIDV4Pipe()) id: string,
    @GetUser() payload: User,
  ) {
    await this.accommodationsService.deleteAccommodation(id, payload.id);
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

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthTokenGuard)
  async addImages(
    @Param('id', new ParseUUIDV4Pipe()) accommodationId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() payload: User,
  ) {
    const uploadedImage =
      await this.accommodationsService.addImagesToAccommodation(
        accommodationId,
        files,
        payload.id,
      );

    return { data: uploadedImage };
  }

  @Delete(':id/images/:imageId')
  @HttpCode(204)
  @UseGuards(AuthTokenGuard)
  async deleteImage(
    @Param('id', new ParseUUIDV4Pipe()) accommodationId: string,
    @Param('imageId') imageId: string,
    @GetUser() payload: User,
  ) {
    await this.accommodationsService.deleteImage(
      accommodationId,
      imageId,
      payload.id,
    );
  }
}
