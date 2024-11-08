import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { TransformToInt } from 'src/shared/decorators/transform-to-int.decorator';
import {
  UsersSortBy,
  UsersSortOrder,
} from '../../constants/users-sort-params.constant';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserSearchParamsReqDto {
  @TransformToInt()
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ type: 'integer' })
  page?: number;

  @TransformToInt()
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

  @Transform(
    ({ value }) => {
      return value.toUpperCase();
    },
    { toClassOnly: true },
  )
  @IsOptional()
  @IsEnum(UsersSortOrder)
  @ApiPropertyOptional({ enum: UsersSortOrder })
  sort_order?: UsersSortOrder = UsersSortOrder.Desc;
}
