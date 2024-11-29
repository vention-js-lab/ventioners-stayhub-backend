import { Transform } from 'class-transformer';

export function TransformToUpperCase() {
  return Transform(
    ({ value }) => {
      return typeof value !== 'string' ? undefined : value.toUpperCase();
    },
    { toClassOnly: true },
  );
}
