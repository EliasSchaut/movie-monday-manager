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
} from '@/types/utils/movie.util';
import { DangerException } from '@/common/exceptions/danger.exception';

@Injectable()
export abstract class MovieApiService extends ApiService implements MovieApi {
  protected readonly MAX_SEARCH_RESULTS: number = 6;
  protected abstract API_BASE: string | null;
  protected abstract API_KEY: string | null;
  protected abstract API_TYPE: MovieApiTypeEnum;
  protected abstract API_USED_ID: MovieExternalIdEnum;

  public async find(
    external_id: MovieExternalIdsType,
    lang: string = 'en-US',
  ): Promise<MovieType | null> {
    const id: ExternalId = this.choose_external_id(external_id);
    const movie: ExternalMovieType | null = await this.fetch_movie(id, lang);
    return movie?.to_movie_type(lang) ?? null;
  }

  protected abstract fetch_movie(
    id: ExternalId,
    lang?: string,
  ): Promise<ExternalMovieType | null>;

  protected choose_external_id(ids: MovieExternalIdsType): ExternalId {
    const id = ids[this.API_USED_ID] as ExternalId;
    if (!id) {
      throw new DangerException(
        `${this.API_USED_ID} key not found to find movie via ${this.API_TYPE} API`,
      );
    }
    return id;
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

  protected async call_movie_endpoint(
    id: ExternalId,
    lang: string = 'en-US',
  ): Promise<any> {
    const movie_endpoint = this.gen_movie_link(id, lang);
    return await this.call_api(movie_endpoint);
  }

  protected async call_search_endpoint(
    query: string,
    lang: string = 'en-US',
  ): Promise<any[]> {
    const search_endpoint = this.gen_movie_search_link(query, lang);
    const searches: any[] = await this.call_api(search_endpoint);
    return this.filter_search_results(searches);
  }

  protected filter_search_results(search_results: any[]): any[] {
    return search_results.slice(0, this.MAX_SEARCH_RESULTS + 1);
  }

  protected abstract gen_movie_link(id: ExternalId, lang?: string): string;

  protected abstract gen_movie_search_link(
    query: string,
    lang?: string,
  ): string;
}
