import { MovieType } from '@/types/movie/movie.type';

export abstract class ExternalMovieType {
  public abstract to_movie_type(): MovieType;
}
