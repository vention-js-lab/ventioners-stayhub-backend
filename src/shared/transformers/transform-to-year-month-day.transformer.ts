import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function TransformToYearMonthDay() {
  return Transform(({ value }) => {
    if (!value || typeof value !== 'string') {
      return undefined;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date: ${value}`);
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });
}
