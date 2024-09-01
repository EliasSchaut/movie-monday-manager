import { GraphQLError } from 'graphql/error';
import { ResCodeEnum } from '@/types/common/res_code.enum';

export class Exception extends GraphQLError {
  constructor(
    message: string,
    code: ResCodeEnum = ResCodeEnum.WARNING,
    cause?: any,
  ) {
    super(message, { extensions: { code, cause } });
  }
}
