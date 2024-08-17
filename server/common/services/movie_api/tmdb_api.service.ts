import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { MovieApi } from '@/common/services/movie_api/movie_api.interface';
import { TmdbSearchType } from '@/types/movie/tmdb_search.type';
import { DangerException } from '@/common/exceptions/danger.exception';
import { MovieType } from '@/types/movie/movie.type';
import { TmdbMovieType } from '@/types/movie/tmdb_movie.type';
import { MovieSearchType } from '@/types/movie/movie_search.type';
import { MovieApiService } from '@/common/services/movie_api/movie_api.service';

@Injectable()
export class TmdbApiService extends MovieApiService implements MovieApi {
  private readonly API_KEY: string = process.env.TMDB_API_KEY as string;
  private readonly API_BASE: string = 'https://api.themoviedb.org/3/';

  public async find(
    tmdb_id: string,
    lang: string = 'en-US',
  ): Promise<MovieType | null> {
    const tmdb_movie = await this.find_tmdb_movie(tmdb_id, lang);
    return tmdb_movie?.to_movie_type() ?? null;
  }

  private async find_tmdb_movie(
    tmdb_id: string,
    lang: string = 'en-US',
  ): Promise<TmdbMovieType | null> {
    const tmdb_movie = await this.call_tmdb_api(
      this.gen_movie_link(tmdb_id, lang),
    );
    try {
      return new TmdbMovieType(tmdb_movie);
    } catch (e) {
      return null;
    }
  }

  public async search(
    query: string,
    lang: string = 'en-US',
  ): Promise<MovieSearchType[]> {
    const tmdb_search_results = await this.search_tmdb_api(query, lang);
    return tmdb_search_results.map((result) => result.to_movie_type());
  }

  private async search_tmdb_api(
    query: string,
    lang: string = 'en-US',
  ): Promise<TmdbSearchType[]> {
    const movie_searches = await this.call_tmdb_api(
      this.gen_movie_search_link(query, lang),
    );

    return movie_searches
      .slice(0, this.MAX_SEARCH_RESULTS + 1)
      .map((movie: any) => new TmdbSearchType(movie));
  }

  private async call_tmdb_api(url: string): Promise<any> {
    const tmdb_fetch_timeout = this.create_fetch_timeout();
    const res: Response = await fetch(url).catch(() => {
      clearTimeout(tmdb_fetch_timeout);
      throw new DangerException(
        I18nContext.current()!.t('movie.exception.create_api_not_found'),
      );
    });
    clearTimeout(tmdb_fetch_timeout);
    return await res.json();
  }

  private gen_movie_link(tmdb_id: string, lang: string = 'en-US') {
    return `${this.API_BASE}movie/${tmdb_id}?language=${lang}&api_key=${this.API_KEY}&append_to_response=credits`;
  }

  private gen_movie_search_link(search_query: string, lang: string = 'en-US') {
    return `${this.API_BASE}search/movie?query=${search_query}&language=${lang}&include_adult=true&api_key${this.API_KEY}`;
  }
}
