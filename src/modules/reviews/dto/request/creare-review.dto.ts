import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The review comment provided by the user',
    type: String,
    required: false,
    example: 'This is a review comment.',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    description: 'The rating given by the user',
    type: Number,
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
