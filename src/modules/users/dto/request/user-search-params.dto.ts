import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import {
  TransformToNumber,
  TransformToUpperCase,
} from 'src/shared/transformers';
import {
  UsersSortBy,
  UsersSortOrder,
} from '../../constants/users-sort-params.constant';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserSearchParamsReqDto {
  @TransformToNumber()
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ type: 'integer' })
  page?: number;

  @TransformToNumber()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(200)
  @ApiPropertyOptional({ type: 'integer' })
  limit?: number;

  @IsOptional()
  @IsEnum(UsersSortBy)
  @ApiPropertyOptional({ enum: UsersSortBy })
  sort_by?: UsersSortBy;

  @TransformToUpperCase()
  @IsOptional()
  @IsEnum(UsersSortOrder)
  @ApiPropertyOptional({ enum: UsersSortOrder })
  sort_order?: UsersSortOrder = UsersSortOrder.Desc;
}
