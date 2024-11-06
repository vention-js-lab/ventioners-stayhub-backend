import { IsEnum, IsInt, IsOptional, IsPositive, Max } from 'class-validator';
import { TransformToInt } from 'src/shared/decorators/transform-to-int.decorator';
import {
  UsersSortBy,
  UsersSortOrder,
} from '../../constants/users-sort-params.constant';

export class UserSearchParamsReqDto {
  @TransformToInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @TransformToInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(200)
  limit?: number;

  @IsOptional()
  @IsEnum(UsersSortBy)
  sort_by?: UsersSortBy;

  @IsOptional()
  @IsEnum(UsersSortOrder)
  sort_order?: UsersSortOrder;
}
