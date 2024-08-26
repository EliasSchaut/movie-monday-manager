import { Injectable } from '@nestjs/common';
import { MovieType } from '@/types/movie/movie.type';
import { MovieApi } from '@/common/services/movie_api/movie_api.interface';
import { MovieSearchType } from '@/types/movie/movie_search.type';
import { ApiService } from '@/common/services/api.service';
import { ExternalMovieType } from '@/types/movie/external_movie.type';
import { ExternalSearchType } from '@/types/movie/external_search.type';
import {
  ExternalId,
  MovieApiTypeEnum,
  MovieExternalIdEnum,
  MovieExternalIdsType,
} from '@/types/utils/movie_types.util';
import { DangerException } from '@/common/exceptions/danger.exception';
import * as process from 'node:process';

@Injectable()
export abstract class MovieApiService implements MovieApi {
  protected readonly DEFAULT_LANG: string = process.env
    .DEFAULT_LANGUAGE as string;
  protected readonly MAX_SEARCH_RESULTS: number = Number(
    process.env.MAX_MOVIE_SEARCH_ITEMS,
  );
  protected abstract API_BASE: string | null;
  protected abstract API_KEY: string | null;
  protected abstract API_TYPE: MovieApiTypeEnum;
  protected abstract API_USED_ID: MovieExternalIdEnum;

  constructor(private readonly apiService: ApiService) {}

  private choose_external_id(ids: MovieExternalIdsType): ExternalId {
    const id = ids[this.API_USED_ID] as ExternalId;
    if (!id) {
      throw new DangerException(
        `${this.API_USED_ID} key not found to find movie via ${this.API_TYPE} API`,
      );
    }
    return id;
  }

  public async find(
    external_id: MovieExternalIdsType,
    lang: string = 'en-US',
  ): Promise<MovieType | null> {
    const id: ExternalId = this.choose_external_id(external_id);
    const movie: ExternalMovieType | null = await this.fetch_movie(id, lang);
    try {
      return movie?.to_movie_type(lang) ?? null;
    } catch (e) {
      return null;
    }
  }

  protected abstract fetch_movie(
    id: ExternalId,
    lang?: string,
  ): Promise<ExternalMovieType | null>;

  protected async call_movie_endpoint(
    id: ExternalId,
    options?: { result_key?: string; lang?: string },
  ): Promise<any | null> {
    const movie_endpoint = this.gen_movie_link(id, options?.lang);
    const movie: any = await this.apiService.call_api(movie_endpoint);
    return this.extract_movie_result(movie, options);
  }

  private extract_movie_result(
    movie: any,
    options?: { result_key?: string },
  ): any {
    if (options?.result_key) {
      movie = movie[options.result_key];
    }
    if (movie) {
      return movie;
    } else {
      return null;
    }
  }

  public async search(
    query: string,
    lang: string = 'en-US',
  ): Promise<MovieSearchType[]> {
    const search_results: ExternalSearchType[] = await this.fetch_search(
      query,
      lang,
    );
    return search_results.map((result) => result.to_movie_search_type(lang));
  }

  protected abstract fetch_search(
    query: string,
    lang?: string,
  ): Promise<ExternalSearchType[]>;

  protected async call_search_endpoint(
    query: string,
    options?: { result_key?: string; lang?: string },
  ): Promise<any[]> {
    const search_endpoint = this.gen_movie_search_link(query, options?.lang);
    let searches: any = await this.apiService.call_api(search_endpoint);
    searches = this.extract_search_results(searches, options);
    return this.filter_search_results(searches);
  }

  private extract_search_results(
    searches: any,
    options?: { result_key?: string },
  ): any[] {
    if (options?.result_key) {
      searches = searches[options.result_key];
    }
    if (Array.isArray(searches)) {
      return searches;
    } else {
      throw new DangerException(
        `Movie Api search result was not an array in ${this.API_TYPE} API`,
      );
    }
  }

  protected filter_search_results(search_results: any[]): any[] {
    return search_results.slice(0, this.MAX_SEARCH_RESULTS);
  }

  protected abstract gen_movie_link(id: ExternalId, lang?: string): string;

  protected abstract gen_movie_search_link(
    query: string,
    lang?: string,
  ): string;
}
