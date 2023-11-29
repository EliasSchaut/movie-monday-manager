import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as process from 'process';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql/error';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const i18n = I18nContext.current();
    const gql_ctx = GqlExecutionContext.create(ctx);
    const req = gql_ctx.getContext().req;
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new GraphQLError(i18n!.t('auth.invalid.no_token'), {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET as string,
      });
      req['user'] = Number(payload.username);
    } catch {
      throw new GraphQLError(i18n!.t('auth.invalid.token'), {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
