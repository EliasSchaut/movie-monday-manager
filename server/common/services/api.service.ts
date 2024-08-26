import { Injectable } from '@nestjs/common';
import { DangerException } from '@/common/exceptions/danger.exception';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class ApiService {
  private readonly TIMEOUT_IN_MS: number = 10000;

  public async call_api(
    url: string,
    options?: {
      timeout_in_ms?: number;
      custom_timeout_error?: string;
      custom_fetch_error?: string;
    },
  ): Promise<any> {
    const timeout_in_ms = options?.timeout_in_ms ?? this.TIMEOUT_IN_MS;
    const custom_timeout_error =
      options?.custom_timeout_error ?? 'common.exception.api_timeout';
    const custom_fetch_error =
      options?.custom_fetch_error ?? 'common.exception.api_fetch';

    const res: Response = await Promise.race([
      this.create_fetch_timeout(timeout_in_ms, custom_timeout_error),
      fetch(url).catch(() => {
        throw new DangerException(I18nContext.current()!.t(custom_fetch_error));
      }),
    ]).catch((e: DangerException) => {
      throw e;
    });
    return await res.json();
  }

  private create_fetch_timeout(
    timeout_in_ms: number,
    custom_timeout_error: string,
  ): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new DangerException(I18nContext.current()!.t(custom_timeout_error)),
        );
      }, timeout_in_ms);
    });
  }
}
