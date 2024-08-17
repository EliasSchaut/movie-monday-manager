import { MovieSearchType } from '@/types/movie/movie_search.type';

export abstract class ExternalSearchType {
  public abstract to_movie_search_type(): MovieSearchType;
}
