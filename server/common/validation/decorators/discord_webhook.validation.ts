import { registerDecorator, ValidationOptions } from 'class-validator';
import { DiscordWebhookPattern } from '@/common/validation/patterns/discord_webhook.pattern';

export function IsDiscordWebhook(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsDiscordWebhook',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'undefined' ||
            (typeof value === 'string' && DiscordWebhookPattern.test(value))
          );
        },
      },
    });
  };
}
