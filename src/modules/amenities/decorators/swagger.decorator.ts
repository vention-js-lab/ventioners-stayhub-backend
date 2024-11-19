import { applyDecorators } from '@nestjs/common';
import { GetAmenitiesResponseDto } from '../dto/response';
import { ApiOkResponse } from '@nestjs/swagger';

export function GetAmenitiesSwaggerDecorator() {
  return applyDecorators(
    ApiOkResponse({
      type: GetAmenitiesResponseDto,
    }),
  );
}
