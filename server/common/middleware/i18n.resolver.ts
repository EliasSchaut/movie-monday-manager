import { I18nResolver } from 'nestjs-i18n';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class I18nLangResolver implements I18nResolver {
  resolve(
    ctx: ExecutionContext,
  ): Promise<string | string[] | undefined> | string | string[] | undefined {
    const gql_ctx = GqlExecutionContext.create(ctx);
    const req = gql_ctx.getContext().req;
    const lang = req.headers['accept-language'];
    if (lang === 'de') {
      return 'de';
    } else {
      return 'en';
    }
  }
}
