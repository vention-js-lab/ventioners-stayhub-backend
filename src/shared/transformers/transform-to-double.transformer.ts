import { Transform } from 'class-transformer';

export function TransformToDouble() {
  return Transform(
    ({ value }) => {
      return typeof value !== 'string' ? undefined : parseFloat(value);
    },
    { toClassOnly: true },
  );
}
