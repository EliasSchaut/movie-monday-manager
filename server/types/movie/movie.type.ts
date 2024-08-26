import { ExternalMovieType } from '@/types/movie/external_movie.type';
import { OmitToMovie } from '@/types/utils/movie_types.util';
import { DangerException } from '@/common/exceptions/danger.exception';

export class MovieType extends ExternalMovieType {
  constructor(movie: OmitToMovie<MovieType>) {
    super();
    if (!movie.title || !movie.runtime || !movie.lang_meta) {
      throw new DangerException(
        'Title, Runtime and Lang Meta are required for MovieType',
      );
    }
    Object.assign(this, movie);
  }

  // Basic Information
  title!: string;
  original_title?: string;
  tagline?: string;
  plot_overview?: string;
  genres!: string[];
  original_language?: string;
  spoken_languages!: string[];
  release_date?: Date;
  runtime!: number;
  adult?: boolean;

  // Production Information
  director?: string;
  writer?: string;
  actors?: string[];
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

  // Internal Information
  lang_meta!: string;

  public to_movie_type(lang_meta: string): MovieType {
    this.lang_meta = lang_meta;
    return this;
  }
}
