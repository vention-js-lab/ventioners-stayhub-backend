import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Accommodation, Image, Wishlist } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateAccommodationDto,
  SearchAccommodationQueryParamsDto,
  UpdateAccommodationDto,
  WishlistAccommodationDto,
} from './dto/request';
import { PaginatedResult } from './interfaces';
import { MinioService } from '../minio/minio.service';
import { BucketName } from '../minio/minio.constants';
import { ConfigService } from '@nestjs/config';
import { CategoriesService } from '../categories/categories.service';
import { AmenitiesService } from '../amenities/amenities.service';
import {
  createLocationCoordinates,
  isProd,
  extractFileNameFromUrl,
  generatePublicFileUrl,
} from 'src/shared/helpers';
import sharp from 'sharp';
import { encode } from 'blurhash';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
    private readonly categoryService: CategoriesService,
    private readonly amenitiesService: AmenitiesService,
  ) {}

  async getAccommodations(
    searchParams: SearchAccommodationQueryParamsDto,
  ): Promise<PaginatedResult<Accommodation>> {
    const query =
      this.accommodationRepository.createQueryBuilder('accommodation');

    const page = searchParams.page || 1;
    const limit = searchParams.limit || 10;
    const skip = (page - 1) * limit;

    if (searchParams.location) {
      query.andWhere('accommodation.location ILIKE :location', {
        location: `%${searchParams.location}%`,
      });
    }

    if (searchParams.numberOfGuests) {
      query.andWhere('accommodation.number_of_guests >= :numberOfGuests', {
        numberOfGuests: searchParams.numberOfGuests,
      });
    }

    if (searchParams.fromDate && searchParams.toDate) {
      query
        .leftJoin('booking', 'b', 'b.accommodationId = accommodation.id')
        .andWhere(
          `(
            b.check_in_date >= :checkOut OR
            b.check_out_date <= :checkIn
          )`,
          {
            checkIn: searchParams.fromDate,
            checkOut: searchParams.toDate,
          },
        );
    }

    query.leftJoinAndSelect('accommodation.images', 'images');

    if (searchParams.categoryId) {
      query.innerJoinAndSelect(
        'accommodation.category',
        'category',
        'category.id = :categoryId',
        { categoryId: searchParams.categoryId },
      );
    }

    const totalCount = await query.getCount();

    query.skip(skip).take(limit);

    const items = await query.getMany();

    return {
      items,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async createAccommodation(
    createAccommodationDto: CreateAccommodationDto,
    userId: string,
  ): Promise<Accommodation> {
    const { amenities, categoryId, locationCoordinates, ...accommodationData } =
      createAccommodationDto;

    const resolvedAmenities = amenities?.length
      ? await this.amenitiesService.getAmenitiesByIds(amenities)
      : [];

    const resolvedCategory =
      await this.categoryService.getCategoryById(categoryId);

    const transformedLocationCoordinates = createLocationCoordinates(
      locationCoordinates.coordinates[0],
      locationCoordinates.coordinates[1],
    );

    const newAccommodation = this.accommodationRepository.create({
      ...accommodationData,
      amenities: resolvedAmenities,
      category: resolvedCategory,
      owner: { id: userId },
      locationCoordinates: transformedLocationCoordinates,
    });
    return await this.accommodationRepository.save(newAccommodation);
  }

  async getAccommodationById(
    id: string,
  ): Promise<Accommodation & { overallRating: number }> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
      relations: [
        'amenities',
        'category',
        'owner',
        'images',
        'reviews',
        'reviews.user',
      ],
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation with ID ${id} not found`);
    }

    const overallRating =
      accommodation.reviews.length > 0
        ? Math.round(
            (accommodation.reviews.reduce(
              (acc, review) => acc + Number(review.rating),
              0,
            ) /
              accommodation.reviews.length) *
              100,
          ) / 100
        : 0;

    return { ...accommodation, overallRating };
  }

  async updateAccommodation(
    id: string,
    UpdateAccommodationDto: UpdateAccommodationDto,
    userId: string,
  ): Promise<Accommodation> {
    const {
      amenities,
      categoryId,
      locationCoordinates,
      ...updateAccommodationData
    } = UpdateAccommodationDto;

    const accommodation = await this.getAccommodationById(id);

    if (accommodation.owner.id !== userId) {
      throw new UnauthorizedException('Access denied.');
    }

    if (amenities) {
      accommodation.amenities = amenities?.length
        ? await this.amenitiesService.getAmenitiesByIds(amenities)
        : [];
    }

    if (categoryId) {
      accommodation.category =
        await this.categoryService.getCategoryById(categoryId);
    }

    if (locationCoordinates) {
      const transformedLocationCoordinates = createLocationCoordinates(
        locationCoordinates.coordinates[0],
        locationCoordinates.coordinates[1],
      );

      accommodation.locationCoordinates = transformedLocationCoordinates;
    }

    Object.assign(accommodation, updateAccommodationData);

    return await this.accommodationRepository.save(accommodation);
  }

  async deleteAccommodation(id: string, userId: string): Promise<void> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!accommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    if (accommodation.owner.id !== userId) {
      throw new UnauthorizedException('Access denied.');
    }

    const deletedAccommodation = await this.accommodationRepository.delete(id);
    if (deletedAccommodation.affected === 0) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }
  }

  async toggleWishlistAccommodation(
    payload: WishlistAccommodationDto,
  ): Promise<void> {
    const { userId, accommodationId } = payload;

    const isInWishlist = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, accommodation: { id: accommodationId } },
    });

    if (isInWishlist) {
      await this.wishlistRepository.remove(isInWishlist);

      return;
    }

    const accommodation = await this.accommodationRepository.findOne({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation not found');
    }

    const userWishlist = this.wishlistRepository.create({
      user: { id: userId },
      accommodation,
    });

    await this.wishlistRepository.save(userWishlist);
  }

  async addImagesToAccommodation(
    accommodationId: string,
    files: Express.Multer.File[],
    userId: string,
  ) {
    const accommodation = await this.getAccommodationById(accommodationId);

    if (!accommodation) {
      throw new NotFoundException(
        `Accommodation with ${accommodationId} not found`,
      );
    }
    if (accommodation.owner.id !== userId) {
      throw new UnauthorizedException('Access denied.');
    }

    const uploadedImages = [];

    for (const [index, file] of files.entries()) {
      const sharpInstance = sharp(file.buffer);

      const [fullSizeBuffer, thumbnailBuffer, { data, info }] =
        await Promise.all([
          sharpInstance
            .clone()
            .resize({ width: 1280, height: 720 })
            .jpeg({ quality: 80 })
            .toBuffer(),
          sharpInstance
            .clone()
            .resize({ height: 240, width: 427 })
            .jpeg({ quality: 95 })
            .toBuffer(),
          sharpInstance
            .clone()
            .resize({ height: 240, width: 427 })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true }),
        ]);

      const blurhash = encode(
        new Uint8ClampedArray(data),
        info.width,
        info.height,
        4,
        4,
      );

      const [fullSizeFileName, thumbnailFileName] = await Promise.all([
        this.minioService.uploadFile({
          ...file,
          buffer: fullSizeBuffer,
          size: fullSizeBuffer.length,
        }),
        this.minioService.uploadFile({
          ...file,
          buffer: thumbnailBuffer,
          size: thumbnailBuffer.length,
        }),
      ]);

      const fullSizeUrl = this.buildImageUrl(fullSizeFileName);
      const thumbnailUrl = this.buildImageUrl(thumbnailFileName);

      const image = this.imageRepository.create({
        url: fullSizeUrl,
        order: index,
        accommodation,
        thumbnailUrl,
        blurhash,
      });

      uploadedImages.push(image);
    }

    return await this.imageRepository.save(uploadedImages);
  }

  async deleteImage(
    accommodationId: string,
    imageId: string,
    userId: string,
  ): Promise<void> {
    const accommodation = await this.getAccommodationById(accommodationId);
    if (!accommodation) {
      throw new NotFoundException(
        `Accommodation with ${accommodationId} not found`,
      );
    }
    if (accommodation.owner.id !== userId) {
      throw new UnauthorizedException('Access denied.');
    }

    const image = await this.imageRepository.findOneBy({ id: imageId });

    if (!image) {
      throw new NotFoundException('Image not found.');
    }
    const fileName = extractFileNameFromUrl(image.url);
    await this.minioService.deleteFile(fileName);
    await this.imageRepository.remove(image);
  }

  private buildImageUrl(fileName: string): string {
    return generatePublicFileUrl(
      this.configService.get('MINIO_HOST'),
      this.configService.get('MINIO_PORT'),
      BucketName.Images,
      fileName,
      isProd(this.configService.get('NODE_ENV')),
      this.configService.get('CDN_URL'),
    );
  }
}
