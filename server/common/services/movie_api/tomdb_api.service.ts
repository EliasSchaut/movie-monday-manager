import { MovieApiService } from '@/common/services/movie_api/movie_api.service';
import { MovieApi } from '@/common/services/movie_api/movie_api.interface';
import { Injectable } from '@nestjs/common';
import { DangerException } from '@/common/exceptions/danger.exception';
import { TmdbApiService } from '@/common/services/movie_api/tmdb_api.service';
import { OmdbApiService } from '@/common/services/movie_api/omdb_api.service';
import { MovieType } from '@/types/movie/movie.type';
import { MovieSearchType } from '@/types/movie/movie_search.type';
import {
  MovieApiTypeEnum,
  MovieExternalIdEnum,
  TmdbId,
} from '@/types/movie/movie_type.utils';
import { ApiService } from '@/common/services/api.service';

@Injectable()
export class TomdbApiService extends MovieApiService implements MovieApi {
  protected API_BASE = null;
  protected API_KEY = null;
  protected API_TYPE = MovieApiTypeEnum.TOMDB;
  protected API_USED_ID = MovieExternalIdEnum.TMDB;
  private readonly tmdbApiService: TmdbApiService;
  private readonly omdbApiService: OmdbApiService;

  constructor(apiService: ApiService) {
    super(apiService);
    this.tmdbApiService = new TmdbApiService(apiService);
    this.omdbApiService = new OmdbApiService(apiService);
  }

  protected async fetch_movie(
    tmdb_id: TmdbId,
    lang?: string,
  ): Promise<MovieType | null> {
    const tmdb_movie = await this.tmdbApiService.find({ tmdb_id }, lang);
    if (!tmdb_movie || !tmdb_movie.imdb_id) return null;

    const omdb_movie = await this.omdbApiService.find(
      { imdb_id: tmdb_movie.imdb_id },
      lang,
    );
    if (!omdb_movie) return null;

    return new MovieType({
      ...tmdb_movie,
      director: omdb_movie.director,
      writer: omdb_movie.writer,
      imdb_rate: omdb_movie.imdb_rate,
      metascore: omdb_movie.metascore,
      rotten_tomato_rate: omdb_movie.rotten_tomato_rate,
    });
  }

  protected async fetch_search(
    query: string,
    lang?: string,
  ): Promise<MovieSearchType[]> {
    return this.tmdbApiService.search(query, lang);
  }

  protected gen_movie_link(): string {
    throw new DangerException('Method not implemented.');
  }

  protected gen_movie_search_link(): string {
    throw new DangerException('Method not implemented.');
  }
}
