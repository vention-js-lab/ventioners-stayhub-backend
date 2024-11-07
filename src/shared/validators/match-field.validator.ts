import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Custom validation decorator to check if the value of a property matches the value of another specified property.
 * Important: Only works with primitive values.
 *
 * @param field - The name of the field to match against.
 * @param validationOptions - Optional validation options.
 * @returns A function that registers the custom validation decorator.
 *
 * @example
 * ```typescript
 * class User {
 *   @IsString()
 *   password: string;
 *
 *   @MatchField('password', { message: 'Passwords do not match' })
 *   confirmPassword: string;
 * }
 * ```
 */
export function MatchField(
  field: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'matchField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [field],
      options: validationOptions,
      validator: {
        validate(
          value: unknown,
          validationArguments: ValidationArguments,
        ): boolean {
          const [field] = validationArguments.constraints;
          const targetObject = validationArguments.object as Record<
            string,
            unknown
          >;

          return value === targetObject[field];
        },
        defaultMessage(validationArguments) {
          return `${validationArguments?.property} must match ${validationArguments?.constraints[0]} field`;
        },
      },
    });
  };
}
