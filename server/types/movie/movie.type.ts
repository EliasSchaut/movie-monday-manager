import { ExternalMovieType } from '@/types/movie/external_movie.type';
import { OmitToMovie } from '@/types/utils/movie.util';

export class MovieType extends ExternalMovieType {
  constructor(movie: OmitToMovie<MovieType>) {
    super();
    Object.assign(this, movie);
  }

  // Basic Information
  title!: string;
  original_title?: string;
  tagline?: string;
  plot_overview!: string;
  genres!: string[];
  original_language!: string;
  spoken_languages!: string[];
  release_date!: string;
  runtime!: number;
  adult?: boolean;

  // Production Information
  director?: string;
  writer?: string;
  actors!: string[];
  production_companies!: string[];
  production_countries!: string[];
  budget?: number;
  revenue?: number;
  homepage?: string;

  // Identifiers and Ratings
  tmdb_id?: number;
  tmdb_rate?: number;
  imdb_id?: string;
  imdb_rate?: string;
  metascore?: string;
  rotten_tomato_rate?: string;

  // Media Information
  poster_path?: string;

  public to_movie_type(): MovieType {
    return this;
  }
}
