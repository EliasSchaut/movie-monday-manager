export class MovieApiMovieType {
  title!: string;
  genres!: string[];
  director!: string;
  actors!: string[];
  release_date!: string;
  runtime!: number;
  tagline!: string;
  plot_overview!: string;
  spoken_languages!: string[];
  original_language!: string;
  poster_path?: string;
  writer?: string;
  tmdb_id?: string;
  tmdb_rate?: number;
  imdb_id?: string;
  imdb_rate?: number;
  rotten_tomato_rate?: number;
}
