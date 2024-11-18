import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  GetUsersResponseBodyDto,
  UserDataResponseBodyDto,
} from '../dto/response';

export function GetUsersSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Users retrieved successfully',
      type: GetUsersResponseBodyDto,
    }),
  );
}

export function GetUserSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'User retrieved successfully',
      type: UserDataResponseBodyDto,
    }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
  );
}

export function CreateUserSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'User created successfully',
      type: UserDataResponseBodyDto,
    }),
    ApiBadRequestResponse({
      description: 'User with email already exists',
    }),
  );
}

export function UpdateUserSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'User updated successfully',
      type: UserDataResponseBodyDto,
    }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
  );
}

export function UpdateUserWishlistSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Accommmodation added to wishlist successfully',
    }),
    ApiNotFoundResponse({
      description: 'User or accommodation not found',
    }),
  );
}

export function DeleteUserSwaggerDecorator() {
  return applyDecorators(
    ApiNoContentResponse({
      description: 'User deleted successfully',
    }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
  );
}
