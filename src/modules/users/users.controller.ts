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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ParseUUIDV4Pipe } from 'src/shared/pipes';
import {
  UserSearchParamsReqDto,
  CreateUserReqDto,
  UpdateUserReqDto,
} from './dto/request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async getUsers(@Query() searchParams: UserSearchParamsReqDto) {
    const { users, totalCount, totalPages } =
      await this.usersService.getUsers(searchParams);

    return {
      data: users,
      totalCount: totalCount,
      totalPages: totalPages,
      message: 'Users retrieved successfully',
    };
  }

  @Get(':userId')
  async getUser(@Param('userId', new ParseUUIDV4Pipe()) userId: string) {
    const user = await this.usersService.getUser(userId);

    return {
      data: user,
      message: 'User retrieved successfully',
    };
  }

  @Post('')
  async createUser(
    @Body()
    dto: CreateUserReqDto,
  ) {
    const newUser = await this.usersService.createUser(dto);

    return {
      data: newUser,
      message: 'User created successfully',
    };
  }

  @Delete(':userId')
  @HttpCode(204)
  async deleteUser(@Param('userId', new ParseUUIDV4Pipe()) userId: string) {
    await this.usersService.deleteUser(userId);
  }

  @Put(':userId')
  async updateUser(
    @Body() dto: UpdateUserReqDto,
    @Param('userId', new ParseUUIDV4Pipe()) userId: string,
  ) {
    const updatedUser = await this.usersService.updateUser(dto, userId);

    return {
      data: updatedUser,
      message: 'User updated successfully',
    };
  }
}
