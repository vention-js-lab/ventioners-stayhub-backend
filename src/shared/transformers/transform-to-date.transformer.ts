import { Transform } from 'class-transformer';

export function TransformToDate() {
  return Transform(
    ({ value }) => {
      if (!value || typeof value !== 'string') {
        return undefined;
      }

      const date = new Date(value);

      return isNaN(date.getTime()) ? undefined : date;
    },
    { toClassOnly: true },
  );
}
