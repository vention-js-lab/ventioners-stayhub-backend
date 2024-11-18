import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
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
  UpdateUserWishlistSwaggerDecorator,
} from './decorators/swagger.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { JwtPayload } from 'jsonwebtoken';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async updateUser(
    @Body() dto: UpdateUserReqDto,
    @Param('userId', new ParseUUIDV4Pipe()) userId: string,
  ) {
    const updatedUser = await this.usersService.updateUser(dto, userId);

    return {
      data: updatedUser,
    };
  }

  @Put('/wishlist/:accommodationId')
  @UseGuards(JwtAuthGuard)
  @UpdateUserWishlistSwaggerDecorator()
  async toggleWishlistAccommodation(
    @Param('accommodationId', new ParseUUIDV4Pipe()) accommodationId: string,
    @GetUser() payload: JwtPayload,
  ) {
    try {
      const userId = payload.sub;
      await this.usersService.wishlistAccommodation(userId, accommodationId);
    } catch (error) {
      throw new NotFoundException({
        message: 'User or accommodation not found',
        error,
      });
    }
  }
}
