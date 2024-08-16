import { MovieType } from '@/types/movie/movie.type';
import { MovieSearchType } from '@/types/movie/movie_search.type';

export interface MovieApi {
  find(id: string, lang: string): Promise<MovieType | null>;
  search(query: string, lang: string): Promise<MovieSearchType[]>;
}
