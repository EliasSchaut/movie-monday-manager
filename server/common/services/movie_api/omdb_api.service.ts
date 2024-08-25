import { Injectable } from '@nestjs/common';
import { MovieApiService } from '@/common/services/movie_api/movie_api.service';
import { MovieApi } from '@/common/services/movie_api/movie_api.interface';
import { OmdbMovieType } from '@/types/movie/omdb_movie.type';
import { OmdbSearchType } from '@/types/movie/omdb_search.type';
import {
  ImdbId,
  MovieApiTypeEnum,
  MovieExternalIdEnum,
} from '@/types/utils/movie.util';

@Injectable()
export class OmdbApiService extends MovieApiService implements MovieApi {
  protected readonly API_BASE: string = 'https://www.omdbapi.com/';
  protected readonly API_KEY: string = process.env.OMDB_API_KEY as string;
  protected API_TYPE = MovieApiTypeEnum.OMDB;
  protected API_USED_ID = MovieExternalIdEnum.IMDB;

  protected async fetch_movie(imdb_id: ImdbId): Promise<OmdbMovieType | null> {
    const movie: any = this.call_movie_endpoint(imdb_id);

    try {
      return new OmdbMovieType(movie);
    } catch (e) {
      return null;
    }
  }

  protected async fetch_search(query: string): Promise<OmdbSearchType[]> {
    const searches = await this.call_search_endpoint(query);

    try {
      return searches.map((movie: any) => new OmdbSearchType(movie));
    } catch (e) {
      return [];
    }
  }

  protected gen_movie_link(imdb_id: ImdbId): string {
    return `${this.API_BASE}?apikey=${this.API_KEY}&i=${imdb_id}&plot=short`;
  }

  protected gen_movie_search_link(query: string): string {
    return `${this.API_BASE}?apikey=${this.API_KEY}&s=${query}&type=movie`;
  }
}
