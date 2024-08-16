import { Injectable } from '@nestjs/common';
import { MovieType } from '@/types/movie/movie.type';
import { MovieApi } from '@/common/services/movie_api/movie_api.interface';
import { MovieSearchType } from '@/types/movie/movie_search.type';
import { DangerException } from '@/common/exceptions/danger.exception';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export abstract class MovieApiService implements MovieApi {
  protected readonly MAX_SEARCH_RESULTS: number = 6;
  protected readonly TIMEOUT_IN_MS: number = 10000;

  public abstract find(id: string, lang: string): Promise<MovieType | null>;

  public abstract search(
    query: string,
    lang: string,
  ): Promise<MovieSearchType[]>;

  protected create_fetch_timeout() {
    return setTimeout(() => {
      throw new DangerException(
        I18nContext.current()!.t('movie.exception.fetch_timeout'),
      );
    }, this.TIMEOUT_IN_MS);
  }
}
