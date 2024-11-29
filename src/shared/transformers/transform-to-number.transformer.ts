import { Transform } from 'class-transformer';

export function TransformToNumber() {
  return Transform(
    ({ value }) => {
      return typeof value !== 'string' ? undefined : parseInt(value, 10);
    },
    { toClassOnly: true },
  );
}
