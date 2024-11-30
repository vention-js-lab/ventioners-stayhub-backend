import { Transform } from 'class-transformer';

export function TransformToJson() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        console.error('Invalid JSON string:', value);
        throw new Error('Invalid JSON string');
      }
    }
    return value;
  });
}
