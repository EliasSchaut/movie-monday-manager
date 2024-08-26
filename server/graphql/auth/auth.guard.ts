import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as process from 'process';
import { GqlExecutionContext } from '@nestjs/graphql';
import { I18nService } from 'nestjs-i18n';
import { WarningException } from '@/common/exceptions/warning.exception';
import { Reflector } from '@nestjs/core';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/enums/role.enum';
import { I18nLangResolver } from '@/common/middleware/i18n.resolver';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt_service: JwtService,
    private readonly i18n: I18nService,
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
      const curr_lang = this.i18n_resolver.get_current_lang(ctx);
      throw new WarningException(
        this.i18n.t('auth.exception.no_token', { lang: curr_lang }),
      );
    }

    let payload;
    try {
      payload = await this.jwt_service.verifyAsync(token, {
        secret: process.env.JWT_SECRET as string,
      });
    } catch {
      const curr_lang = this.i18n_resolver.get_current_lang(ctx);
      throw new WarningException(
        this.i18n.t('auth.exception.invalid_token', { lang: curr_lang }),
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
