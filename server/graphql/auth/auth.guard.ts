import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as process from 'process';
import { GqlExecutionContext } from '@nestjs/graphql';
import { I18nContext } from 'nestjs-i18n';
import { WarningException } from '@/common/exceptions/warning.exception';
import { Reflector } from '@nestjs/core';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/enums/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt_service: JwtService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const role: RoleEnum | undefined = this.reflector.get(
      Role,
      ctx.getHandler(),
    );
    if (!role) return true;

    const gql_ctx = GqlExecutionContext.create(ctx);
    const i18n = I18nContext.current();
    const req = gql_ctx.getContext().req;
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new WarningException(i18n!.t('auth.invalid.no_token'));
    }

    let payload;
    try {
      payload = await this.jwt_service.verifyAsync(token, {
        secret: process.env.JWT_SECRET as string,
      });
    } catch {
      throw new WarningException(i18n!.t('auth.invalid.token'));
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
