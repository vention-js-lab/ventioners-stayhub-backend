import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Accommodation, Image, Wishlist } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  WishlistAccommodationDto,
  SearchAccommodationQueryParamsDto,
  UpdateAccommodationDto,
  CreateAccommodationDto,
} from './dto/request';
import { PaginatedResult } from './interfaces';
import { User } from '../users/entities/user.entity';
import { MinioService } from '../minio/minio.service';
import { BucketName } from '../minio/minio.constants';
import { ConfigService } from '@nestjs/config';
import { CategoriesService } from '../categories/categories.service';
import { AmenitiesService } from '../amenities/amenities.service';
import { buildMinioFileUrl } from 'src/shared/util/urlBuilder';
import { extractFileNameFromUrl } from 'src/shared/util/exractFileName';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
        '(accommodation.name ILIKE :search OR accommodation.description ILIKE :search OR accommodation.location ILIKE :search)',
        { search: `%${searchParams.search}%` },
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
    const { amenities, categoryId, ...accommodationData } =
      createAccommodationDto;

    const resolvedAmenities = amenities?.length
      ? await this.amenitiesService.getAmenitiesByIds(amenities)
      : [];

    const resolvedCategory =
      await this.categoryService.getCategoryById(categoryId);

    const newAccommodation = this.accommodationRepository.create({
      ...accommodationData,
      amenities: resolvedAmenities,
      category: resolvedCategory,
      owner: { id: userId },
    });
    return await this.accommodationRepository.save(newAccommodation);
  }

  async getAccommodationById(id: string): Promise<Accommodation> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
      relations: ['amenities', 'category', 'owner', 'images'],
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation with ID ${id} not found`);
    }

    return accommodation;
  }

  async updateAccommodation(
    id: string,
    UpdateAccommodationDto: UpdateAccommodationDto,
    userId: string,
  ): Promise<Accommodation> {
    const { amenities, categoryId, ...updateAccommodationData } =
      UpdateAccommodationDto;

    const accommodation = await this.getAccommodationById(id);
    if (accommodation.owner.id !== userId) {
      throw new UnauthorizedException('Access denied.');
    }

    if (amenities) {
      const resolvedAmenities = amenities?.length
        ? await this.amenitiesService.getAmenitiesByIds(amenities)
        : [];

      accommodation.amenities = resolvedAmenities;
    }

    if (categoryId) {
      const resolvedCategory =
        await this.categoryService.getCategoryById(categoryId);

      accommodation.category = resolvedCategory;
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
  ): Promise<boolean> {
    const { userId, accommodationId } = payload;

    const isInWishlist = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, accommodation: { id: accommodationId } },
    });

    if (isInWishlist) {
      await this.wishlistRepository.remove(isInWishlist);
      return false;
    } else {
      const accommodation = await this.accommodationRepository.findOne({
        where: { id: accommodationId },
      });

      if (!accommodation) {
        throw new NotFoundException('Accommodation not found');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });

      const userWishlist = new Wishlist();
      userWishlist.user = user;
      userWishlist.accommodation = accommodation;

      await this.wishlistRepository.save(userWishlist);
      return true;
    }
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
      const fileName = await this.minioService.uploadFile(file);

      const url = buildMinioFileUrl(
        this.configService.get('MINIO_HOST'),
        this.configService.get('MINIO_PORT'),
        BucketName.Images,
        fileName,
      );
      const image = this.imageRepository.create({
        url,
        order: index,
        accommodation,
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
}
