import { User } from './entities/user.entity';
import { UserSearchParamsReqDto, CreateUserReqDto } from './dto/request';
import {
  DataSource,
  DeleteResult,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getAllUsers(
    searchParams: UserSearchParamsReqDto,
  ): Promise<{ users: User[]; totalCount: number; totalPages: number }> {
    const {
      page = 0,
      limit = 10,
      sort_by: sortBy,
      sort_order: sortOrder,
    } = searchParams;

    const queryBuilder = this.createQueryBuilder('users');

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(sortBy, sortOrder);
    }

    const [users, totalCount] = await queryBuilder
      .take(limit)
      .skip(page * limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      totalCount,
      totalPages,
    };
  }

  async getUserBy(options: FindOptionsWhere<User>): Promise<User | null> {
    return await this.findOneBy(options);
  }

  async createUser(dto: CreateUserReqDto): Promise<User> {
    const { password, ...rest } = dto;
    const newUser = this.create({ passwordHash: password, ...rest });

    return await this.save(newUser);
  }

  async updateUser(dto: Partial<User>, userId: string): Promise<User | null> {
    const user = await this.findOneBy({ id: userId });

    if (!user) {
      return null;
    }

    return await this.save({ ...user, ...dto });
  }

  async deleteUser(userId: string): Promise<DeleteResult> {
    return await this.delete({ id: userId });
  }
}
