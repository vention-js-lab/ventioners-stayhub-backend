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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ParseUUIDV4Pipe } from 'src/shared/pipes';
import {
  UserSearchParamsReqDto,
  CreateUserReqDto,
  UpdateUserReqDto,
} from './dto/request';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserSwaggerDecorator,
  DeleteUserSwaggerDecorator,
  GetUserSwaggerDecorator,
  GetUsersSwaggerDecorator,
  UpdateUserSwaggerDecorator,
  GetWishlistSwaggerDecorator,
} from './decorators/swagger.decorator';
import { AuthTokenGuard } from 'src/shared/guards';
import { GetUser } from 'src/shared/decorators';
import { User } from './entities/user.entity';
import { omit } from 'src/shared/helpers/omit-from-object.helper';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('wishlist')
  @UseGuards(AuthTokenGuard)
  @GetWishlistSwaggerDecorator()
  async getWishlist(@GetUser() user: User) {
    const accommodations = await this.usersService.getWishlist(user.id);

    return {
      data: accommodations,
    };
  }

  @Get('')
  @GetUsersSwaggerDecorator()
  async getUsers(@Query() searchParams: UserSearchParamsReqDto) {
    const { users, totalCount, totalPages } =
      await this.usersService.getUsers(searchParams);

    return {
      data: users,
      totalCount: totalCount,
      totalPages: totalPages,
    };
  }

  @Get('me')
  @UseGuards(AuthTokenGuard)
  async getCurrentUser(@GetUser() user: User) {
    const publicUser = omit<User>(user, [
      'passwordHash',
      'updatedAt',
      'createdAt',
    ]);

    return { user: publicUser };
  }

  @Get(':userId')
  @GetUserSwaggerDecorator()
  async getUser(@Param('userId', new ParseUUIDV4Pipe()) userId: string) {
    const user = await this.usersService.getUser(userId);

    return {
      data: user,
    };
  }

  @Post('')
  @CreateUserSwaggerDecorator()
  async createUser(
    @Body()
    dto: CreateUserReqDto,
  ) {
    const newUser = await this.usersService.createUser(dto);

    return {
      data: newUser,
    };
  }

  @Delete(':userId')
  @DeleteUserSwaggerDecorator()
  @HttpCode(204)
  async deleteUser(@Param('userId', new ParseUUIDV4Pipe()) userId: string) {
    await this.usersService.deleteUser(userId);
  }

  @Put(':userId')
  @UpdateUserSwaggerDecorator()
  @UseInterceptors(FileInterceptor('file'))
  async updateUser(
    @Body() dto: UpdateUserReqDto,
    @Param('userId', new ParseUUIDV4Pipe()) userId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updatedUser = await this.usersService.updateUser(dto, userId, file);

    return {
      data: updatedUser,
    };
  }
}
