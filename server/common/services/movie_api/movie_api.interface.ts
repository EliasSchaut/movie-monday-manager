import { MovieApiMovieType } from '@/types/movie/movie_api_movie.type';
import { MovieApiSearchType } from '@/types/movie/movie_api_search.type';

export interface MovieAPI {
  find(id: string, lang: string): Promise<MovieApiMovieType | null>;
  search(query: string, lang: string): Promise<MovieApiSearchType | null>;
}
