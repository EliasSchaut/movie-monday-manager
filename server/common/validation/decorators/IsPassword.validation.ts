import { registerDecorator, ValidationOptions } from 'class-validator';
import { PasswordPattern } from '@/common/validation/patterns/password.pattern';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'undefined' ||
            (typeof value === 'string' && PasswordPattern.test(value))
          );
        },
      },
    });
  };
}
