import { MovieType } from '@/types/movie/movie.type';
import { MovieSearchType } from '@/types/movie/movie_search.type';
import { ExternalIds } from '@/types/utils/movie.util';

export interface MovieApi {
  find(id: ExternalIds, lang: string): Promise<MovieType | null>;
  search(query: string, lang: string): Promise<MovieSearchType[]>;
}
