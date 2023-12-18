import { GraphQLError } from 'graphql/error';

export class DangerException extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: ResCodeEnum.DANGER } });
  }
}
