import { registerDecorator, ValidationOptions } from 'class-validator';
import { UsernamePattern } from '@/common/validation/patterns/username.pattern';

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'undefined' ||
            (typeof value === 'string' && UsernamePattern.test(value))
          );
        },
      },
    });
  };
}
