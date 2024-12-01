import { Transform } from 'class-transformer';

export function TransformToFloat() {
  return Transform(
    ({ value }) => {
      return typeof value !== 'string' ? undefined : parseFloat(value);
    },
    { toClassOnly: true },
  );
}
