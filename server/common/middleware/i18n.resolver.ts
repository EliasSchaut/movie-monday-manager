import { I18nResolver, I18nService } from 'nestjs-i18n';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class I18nLangResolver implements I18nResolver {
  constructor(private readonly i18n: I18nService) {}

  private readonly DEFAULT_LANG = process.env.DEFAULT_LANGUAGE as string;

  resolve(
    ctx: ExecutionContext,
  ): Promise<string | string[] | undefined> | string | string[] | undefined {
    const gql_ctx = GqlExecutionContext.create(ctx);
    const req = gql_ctx.getContext().req;
    const curr_lang = req.headers['accept-language'];
    const is_curr_lang_supported = this.i18n
      .getSupportedLanguages()
      .includes(curr_lang);
    return is_curr_lang_supported ? curr_lang : this.DEFAULT_LANG;
  }

  get_current_lang(ctx: ExecutionContext): string {
    return this.resolve(ctx) as string;
  }
}
