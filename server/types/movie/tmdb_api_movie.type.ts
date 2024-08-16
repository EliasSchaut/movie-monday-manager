import { MovieType } from '@/types/movie/movie.type';

export class TmdbApiMovieType {
  constructor(tmdb_movie: any) {
    this.tmdb_id = tmdb_movie.id;
    this.title = tmdb_movie.title;
    this.genres = tmdb_movie.genres.map((genre: any) => genre.name);
    this.release_date = tmdb_movie.release_date;
    this.runtime = Number(tmdb_movie.runtime);
    this.tagline = tmdb_movie.tagline;
    this.plot_overview = tmdb_movie.overview;
    this.spoken_languages = tmdb_movie.spoken_languages.map(
      (lang: any) => lang.name,
    );
    this.original_language = tmdb_movie.original_language;
    this.poster_path = tmdb_movie.poster_path;
    this.tmdb_rate = tmdb_movie.vote_average;
    this.imdb_id = tmdb_movie.imdb_id;
  }

  tmdb_id!: string;
  title!: string;
  genres!: string[];
  release_date!: string;
  runtime!: number;
  tagline!: string;
  plot_overview!: string;
  spoken_languages!: string[];
  original_language!: string;
  poster_path?: string;
  tmdb_rate!: number;
  imdb_id?: string;
  director?: string;
  writer?: string;
  actors?: string[];

  public to_movie_type(): MovieType {
    return this as MovieType;
  }
}
