import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetCategoriesResponseBodyDto } from '../dto/response';

export function GetCategoriesSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Get all accommodation categories',
      type: GetCategoriesResponseBodyDto,
    }),
  );
}
