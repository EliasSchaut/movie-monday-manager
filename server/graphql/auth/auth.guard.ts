import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as process from 'process';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/enums/role.enum';
import { I18nLangResolver } from '@/common/middleware/i18n.resolver';
import { ForbiddenException } from '@/common/exceptions/forbidden.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt_service: JwtService,
    private readonly i18n_resolver: I18nLangResolver,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const role: RoleEnum | undefined = this.reflector.get(
      Role,
      ctx.getHandler(),
    );
    if (!role) return true;

    const gql_ctx = GqlExecutionContext.create(ctx);
    const req = gql_ctx.getContext().req;
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new ForbiddenException(
        this.i18n_resolver.t('auth.exception.no_token', ctx),
      );
    }

    let payload;
    try {
      payload = await this.jwt_service.verifyAsync(token, {
        secret: process.env.JWT_SECRET as string,
      });
    } catch {
      throw new ForbiddenException(
        this.i18n_resolver.t('auth.exception.invalid_token', ctx),
      );
    }

    req['user'] = payload.username;
    if (role === RoleEnum.ADMIN) {
      return payload.sub.is_admin;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
