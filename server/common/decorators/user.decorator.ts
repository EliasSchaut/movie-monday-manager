import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gql_ctx = GqlExecutionContext.create(ctx);
    const request = gql_ctx.getContext().req;
    return request.user;
  },
);
