import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsMovieId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMovieId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          return typeof value === 'number' && value >= 0 && value <= 999999999;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a number between 0 and 999999999`;
        },
      },
    });
  };
}
