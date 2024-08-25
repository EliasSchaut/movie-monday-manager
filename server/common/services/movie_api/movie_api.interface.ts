import { MovieType } from '@/types/movie/movie.type';
import { MovieSearchType } from '@/types/movie/movie_search.type';
import { MovieExternalIdsType } from '@/types/utils/movie_types.util';

export interface MovieApi {
  find(id: MovieExternalIdsType, lang: string): Promise<MovieType | null>;
  search(query: string, lang: string): Promise<MovieSearchType[]>;
}
