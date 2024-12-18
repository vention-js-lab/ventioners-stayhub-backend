import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (!(value instanceof Date)) return false;

          const today = new Date(Date.now());

          today.setHours(0, 0, 0, 0);

          return value >= today;
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `${validationArguments?.property} must not be in the past.`;
        },
      },
    });
  };
}
