import { Injectable } from '@nestjs/common';
import { TmdbApiMovieType } from '@/types/tmdb_api_movie.type';
import { I18nContext } from 'nestjs-i18n';
import { TmdbApiSearchType } from '@/types/tmdb_api_search.type';
import { DangerException } from '@/common/exceptions/danger.exception';
import { TmdbApiCreditsType } from '@/types/tmdb_api_credits.type';

@Injectable()
export class TmdbApiService {
  private readonly api_key: string = process.env.TMDB_API_KEY as string;
  private readonly TIMEOUT_IN_MS: number = 10000;
  private readonly MAX_SEARCH_RESULTS: number = 6;

  public async find(
    tmdb_id: string,
    lang: string = 'en-US',
  ): Promise<TmdbApiMovieType | null> {
    const movie = await this.call_tmdb_api(this.gen_movie_link(tmdb_id, lang));
    return new TmdbApiMovieType(movie);
  }

  public async find_credits(tmdb_id: string): Promise<TmdbApiCreditsType> {
    const movie_credits = await this.call_tmdb_api(
      this.gen_credit_link(tmdb_id),
    );
    return new TmdbApiCreditsType(movie_credits);
  }

  public async search(
    search_query: string,
    lang: string = 'en-US',
  ): Promise<TmdbApiSearchType[]> {
    const movie_searches = await this.call_tmdb_api(
      this.gen_movie_search_link(search_query, lang),
    );

    return movie_searches
      .slice(0, this.MAX_SEARCH_RESULTS + 1)
      .map((movie: any) => new TmdbApiSearchType(movie));
  }

  private fetch_timeout() {
    return setTimeout(() => {
      throw new DangerException(
        I18nContext.current()!.t('movie.exception.create_api_not_found'),
      );
    }, this.TIMEOUT_IN_MS);
  }

  private async call_tmdb_api(url: string): Promise<any> {
    const fetch_timeout = this.fetch_timeout();
    const res: Response = await fetch(url).catch(() => {
      clearTimeout(fetch_timeout);
      throw new DangerException(
        I18nContext.current()!.t('movie.exception.create_api_not_found'),
      );
    });
    clearTimeout(fetch_timeout);
    return await res.json();
  }

  private gen_movie_link(tmdb_id: string, lang: string = 'en-US') {
    return `https://api.themoviedb.org/3/movie/${tmdb_id}?language=${lang}&api_key${this.api_key}`;
  }

  private gen_credit_link(tmdb_id: string, lang: string = 'en-US') {
    return `https://api.themoviedb.org/3/movie/${tmdb_id}/credits?language=${lang}&api_key${this.api_key}`;
  }

  private gen_movie_search_link(search_query: string, lang: string = 'en-US') {
    return `https://api.themoviedb.org/3/search/movie?query=${search_query}&language=${lang}&include_adult=true&api_key${this.api_key}`;
  }
}
