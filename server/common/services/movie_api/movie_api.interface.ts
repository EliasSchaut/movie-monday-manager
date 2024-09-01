import { MovieType } from '@/types/movie/movie.type';
import { MovieSearchType } from '@/types/movie/movie_search.type';
import { MovieExternalIdsType } from '@/types/movie/movie_type.utils';

export interface MovieApi {
  find(id: MovieExternalIdsType, lang: string): Promise<MovieType | null>;
  search(query: string, lang: string): Promise<MovieSearchType[]>;
}
