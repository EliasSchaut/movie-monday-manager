import { registerDecorator, ValidationOptions } from 'class-validator';
import { NamePattern } from '@/common/validation/patterns/name.pattern';

export function IsName(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'undefined' ||
            (typeof value === 'string' && NamePattern.test(value))
          );
        },
      },
    });
  };
}
