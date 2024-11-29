import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import {
  UserSearchParamsReqDto,
  CreateUserReqDto,
  UpdateUserReqDto,
} from './dto/request';
import { Hasher } from 'src/shared/libs';
import { Accommodation } from '../accommodations';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinioService } from '../minio/minio.service';
import { BucketName } from '../minio/minio.constants';
import { buildMinioFileUrl } from 'src/shared/util/urlBuilder';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async getUsers(
    searchParams: UserSearchParamsReqDto,
  ): Promise<{ users: User[]; totalCount: number; totalPages: number }> {
    const { users, totalCount, totalPages } =
      await this.usersRepository.getAllUsers(searchParams);

    return { users, totalCount, totalPages };
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.usersRepository.getUserBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }

  async createUser(dto: CreateUserReqDto): Promise<User> {
    const user = await this.usersRepository.getUserBy({ email: dto.email });

    if (user) {
      throw new BadRequestException(
        `User with email ${dto.email} already exists`,
      );
    }

    const password = await Hasher.hashValue(dto.password);
    const newUser = await this.usersRepository.createUser({
      ...dto,
      password,
    });

    return newUser;
  }

  async updateUser(
    dto: UpdateUserReqDto,
    userId: string,
    file?: Express.Multer.File,
  ): Promise<User> {
    const profilePictureName = await this.minioService.uploadFile(
      file,
      BucketName.Images,
    );

    const profilePictureUrl = buildMinioFileUrl(
      this.configService.get('MINIO_HOST'),
      this.configService.get('MINIO_PORT'),
      BucketName.Images,
      profilePictureName,
    );

    const updatedUser = await this.usersRepository.updateUser(
      { ...dto, profilePictureUrl },
      userId,
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const deleteResult = await this.usersRepository.deleteUser(userId);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }

  async getWishlist(userId: string): Promise<Accommodation[]> {
    return this.accommodationRepository
      .createQueryBuilder('accommodation')
      .innerJoinAndSelect('accommodation.likes', 'wishlist')
      .where('wishlist.user.id = :userId', { userId })
      .select('accommodation')
      .getMany();
  }
}
