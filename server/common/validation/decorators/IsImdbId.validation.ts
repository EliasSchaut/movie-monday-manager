import { registerDecorator, ValidationOptions } from 'class-validator';
import { ImdbIdPattern } from '@/common/validation/patterns/imdb_id.pattern';

export function IsImdbId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsImdbId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'undefined' ||
            (typeof value === 'string' && ImdbIdPattern.test(value))
          );
        },
      },
    });
  };
}
