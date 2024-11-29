import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export function TransformToYearMonthDay() {
  return Transform(({ value }) => {
    if (!(value instanceof Date) && typeof value !== 'string') {
      throw new BadRequestException(`Invalid date format: ${value}`);
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date value: ${value}`);
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });
}
