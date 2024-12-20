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
import { Review } from '../reviews/entities';
import { BookingStatus } from '../bookings/constants';

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

    if (searchParams.search) {
      query.andWhere(
        '(accommodation.location ILIKE :search OR accommodation.name ILIKE :search)',
        {
          search: `%${searchParams.search}%`,
        },
      );
    }

    if (searchParams.numberOfGuests) {
      query.andWhere('accommodation.number_of_guests >= :numberOfGuests', {
        numberOfGuests: searchParams.numberOfGuests,
      });
    }

    if (searchParams.fromDate && searchParams.toDate) {
      query.andWhere(
        `NOT EXISTS (
          SELECT 1 FROM booking b
          WHERE "accommodationId" = accommodation.id
            AND status IN (:...activeStatuses)
            AND (
              "check_in_date" <= :checkInDate AND "check_out_date" >= :checkInDate OR
              "check_in_date" <= :checkOutDate AND "check_out_date" >= :checkOutDate OR
              "check_in_date" >= :checkInDate AND "check_out_date" <= :checkOutDate
            )
        )`,
        {
          checkInDate: searchParams.fromDate,
          checkOutDate: searchParams.toDate,
          activeStatuses: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
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

  async getAccommodationsByUser(
    userId: string,
    acceptLanguage: string = 'en',
  ): Promise<Accommodation[]> {
    const accommodations = await this.accommodationRepository.find({
      where: { owner: { id: userId } },
      relations: ['category', 'amenities', 'images', 'category', 'reviews'],
    });

    if (!accommodations.length) {
      throw new NotFoundException('No accommodations found for this user');
    }

    const accommodationsWithOverallRating = accommodations.map((acc) => ({
      ...acc,
      amenities: acc.amenities.map((amenity) => ({
        ...amenity,
        name: acceptLanguage === 'ru' ? amenity.name_ru : amenity.name,
        description:
          acceptLanguage === 'ru'
            ? amenity.description_ru
            : amenity.description,
      })),
      overallRating: this.caculateOverallRating(acc.reviews),
    }));

    return accommodationsWithOverallRating;
  }

  async getAccommodationById(
    id: string,
    acceptLanguage: string = 'en',
  ): Promise<Accommodation & { overallRating: number }> {
    let accommodation = await this.accommodationRepository.findOne({
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

    const overallRating = this.caculateOverallRating(accommodation.reviews);

    accommodation = {
      ...accommodation,
      amenities: accommodation.amenities.map((amenity) => ({
        ...amenity,
        name: acceptLanguage === 'ru' ? amenity.name_ru : amenity.name,
        description:
          acceptLanguage === 'ru'
            ? amenity.description_ru
            : amenity.description,
      })),
    };

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

    if (accommodation.owner.id !== userId) {
      throw new UnauthorizedException('Access denied.');
    }

    const uploadedImages = [];

    for (const [index, file] of files.entries()) {
      const metadata = {
        'x-amz-meta-accommodation-id': accommodationId,
        'x-amz-meta-upload-index': index.toString(),
      };

      const fileName = await this.minioService.uploadFile(
        file,
        BucketName.Images,
        metadata,
      );

      const image = this.imageRepository.create({
        url: this.buildImageUrl(fileName),
        order: index,
        accommodation,
        thumbnailUrl: this.buildImageUrl(fileName),
        blurhash: null,
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

  private caculateOverallRating(reviews: Review[]): number {
    return reviews.length > 0
      ? Math.round(
          (reviews.reduce((acc, review) => acc + Number(review.rating), 0) /
            reviews.length) *
            100,
        ) / 100
      : 0;
  }
}
