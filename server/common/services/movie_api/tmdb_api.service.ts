import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { MovieAPI } from '@/common/services/movie_api/movie_api.interface';
import { TmdbApiMovieMetadataType } from '@/types/movie/tmdb_api_movie_metadata.type';
import { TmdbApiSearchType } from '@/types/movie/tmdb_api_search.type';
import { TmdbApiCreditsType } from '@/types/movie/tmdb_api_credits.type';
import { DangerException } from '@/common/exceptions/danger.exception';
import { MovieApiMovieType } from '@/types/movie/movie_api_movie.type';
import { TmdbApiMovieType } from '@/types/movie/tmdb_api_movie.type';
import { MovieApiSearchType } from '@/types/movie/movie_api_search.type';

@Injectable()
export class TmdbApiService implements MovieAPI {
  private readonly API_KEY: string = process.env.TMDB_API_KEY as string;
  private readonly API_BASE: string = 'https://api.themoviedb.org/3/';
  private readonly TIMEOUT_IN_MS: number = 10000;
  private readonly MAX_SEARCH_RESULTS: number = 6;

  public async find(
    tmdb_id: string,
    lang: string = 'en-US',
  ): Promise<MovieApiMovieType | null> {
    const tmdb_movie = await this.find_tmdb_movie(tmdb_id, lang);
    return tmdb_movie?.to_movie_type() ?? null;
  }

  private async find_tmdb_movie(
    tmdb_id: string,
    lang: string = 'en-US',
  ): Promise<TmdbApiMovieType | null> {
    const metadata = await this.find_metadata(tmdb_id, lang);
    const credits = await this.find_credits(tmdb_id);
    if (metadata && credits) {
      return new TmdbApiMovieType({ metadata, credits });
    }
    return null;
  }

  private async find_metadata(
    tmdb_id: string,
    lang: string = 'en-US',
  ): Promise<TmdbApiMovieMetadataType | null> {
    const movie_metadata = await this.call_tmdb_api(
      this.gen_movie_link(tmdb_id, lang),
    );
    return new TmdbApiMovieMetadataType(movie_metadata);
  }

  private async find_credits(
    tmdb_id: string,
  ): Promise<TmdbApiCreditsType | null> {
    const movie_credits = await this.call_tmdb_api(
      this.gen_credit_link(tmdb_id),
    );
    return new TmdbApiCreditsType(movie_credits);
  }

  public async search(
    query: string,
    lang: string = 'en-US',
  ): Promise<MovieApiSearchType[]> {
    const tmdb_search_results = await this.search_tmdb_api(query, lang);
    return tmdb_search_results.map((result) => result.to_movie_type());
  }

  private async search_tmdb_api(
    query: string,
    lang: string = 'en-US',
  ): Promise<TmdbApiSearchType[]> {
    const movie_searches = await this.call_tmdb_api(
      this.gen_movie_search_link(query, lang),
    );

    return movie_searches
      .slice(0, this.MAX_SEARCH_RESULTS + 1)
      .map((movie: any) => new TmdbApiSearchType(movie));
  }

  private async call_tmdb_api(url: string): Promise<any> {
    const tmdb_fetch_timeout = this.create_tmdb_fetch_timeout();
    const res: Response = await fetch(url).catch(() => {
      clearTimeout(tmdb_fetch_timeout);
      throw new DangerException(
        I18nContext.current()!.t('movie.exception.create_api_not_found'),
      );
    });
    clearTimeout(tmdb_fetch_timeout);
    return await res.json();
  }

  private create_tmdb_fetch_timeout() {
    return setTimeout(() => {
      throw new DangerException(
        I18nContext.current()!.t('movie.exception.create_api_not_found'),
      );
    }, this.TIMEOUT_IN_MS);
  }

  private gen_movie_link(tmdb_id: string, lang: string = 'en-US') {
    return `${this.API_BASE}movie/${tmdb_id}?language=${lang}&api_key${this.API_KEY}`;
  }

  private gen_credit_link(tmdb_id: string, lang: string = 'en-US') {
    return `${this.API_BASE}movie/${tmdb_id}/credits?language=${lang}&api_key${this.API_KEY}`;
  }

  private gen_movie_search_link(search_query: string, lang: string = 'en-US') {
    return `${this.API_BASE}search/movie?query=${search_query}&language=${lang}&include_adult=true&api_key${this.API_KEY}`;
  }
}
