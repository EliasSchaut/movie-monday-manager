import { Injectable } from '@nestjs/common';
import { MovieApi } from '@/common/services/movie_api/movie_api.interface';
import { TmdbSearchType } from '@/types/movie/tmdb_search.type';
import { TmdbMovieType } from '@/types/movie/tmdb_movie.type';
import { MovieApiService } from '@/common/services/movie_api/movie_api.service';
import {
  MovieApiTypeEnum,
  MovieExternalIdEnum,
  TmdbId,
} from '@/types/utils/movie_types.util';

@Injectable()
export class TmdbApiService extends MovieApiService implements MovieApi {
  protected readonly API_KEY: string = process.env.TMDB_API_KEY as string;
  protected readonly API_BASE: string = 'https://api.themoviedb.org/3/';
  protected API_TYPE = MovieApiTypeEnum.TMDB;
  protected API_USED_ID = MovieExternalIdEnum.TMDB;

  protected async fetch_movie(
    tmdb_id: TmdbId,
    lang: string = 'en-US',
  ): Promise<TmdbMovieType | null> {
    const movie: any = await this.call_movie_endpoint(tmdb_id, lang);
    try {
      return new TmdbMovieType(movie);
    } catch (e) {
      return null;
    }
  }

  protected async fetch_search(
    query: string,
    lang: string = 'en-US',
  ): Promise<TmdbSearchType[]> {
    const searches = await this.call_search_endpoint(query, lang);

    try {
      return searches.map((movie: any) => new TmdbSearchType(movie));
    } catch (e) {
      return [];
    }
  }

  protected gen_movie_link(tmdb_id: TmdbId, lang: string = 'en-US') {
    return `${this.API_BASE}movie/${tmdb_id}?language=${lang}&api_key=${this.API_KEY}&append_to_response=credits`;
  }

  protected gen_movie_search_link(query: string, lang: string = 'en-US') {
    return `${this.API_BASE}search/movie?query=${query}&language=${lang}&include_adult=true&api_key=${this.API_KEY}`;
  }
}
