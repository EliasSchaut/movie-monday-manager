import { Injectable } from '@nestjs/common';
import { DangerException } from '@/common/exceptions/danger.exception';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class ApiService {
  private readonly TIMEOUT_IN_MS: number = 10000;

  protected async call_api(
    url: string,
    options = {
      timeout_in_ms: this.TIMEOUT_IN_MS,
      custom_timeout_error: 'common:exception.api_timeout',
      custom_fetch_error: 'common:exception.api_fetch',
    },
  ): Promise<any> {
    const fetch_timeout = this.create_fetch_timeout({
      timeout_in_ms: options.timeout_in_ms,
      custom_error_key: options.custom_timeout_error,
    });
    const res: Response = await fetch(url).catch(() => {
      clearTimeout(fetch_timeout);
      throw new DangerException(
        I18nContext.current()!.t(options.custom_fetch_error),
      );
    });
    clearTimeout(fetch_timeout);
    return await res.json();
  }

  private create_fetch_timeout(
    options = {
      timeout_in_ms: this.TIMEOUT_IN_MS,
      custom_error_key: 'common:exception.api_timeout',
    },
  ): NodeJS.Timeout {
    return setTimeout(() => {
      throw new DangerException(
        I18nContext.current()!.t(options.custom_error_key),
      );
    }, options.timeout_in_ms);
  }
}
