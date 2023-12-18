import { GraphQLError } from 'graphql/error';

export class WarningException extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: ResCodeEnum.WARNING } });
  }
}
