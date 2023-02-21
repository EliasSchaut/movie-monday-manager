import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from "@/types/user.types/user_jwt.type";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) : JwtUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
