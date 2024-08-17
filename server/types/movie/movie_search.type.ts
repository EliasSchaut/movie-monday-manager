export class MovieSearchType {
  constructor(movie: MovieSearchType) {
    Object.assign(this, movie);
  }

  title!: string;
  poster_path!: string;
  release_date!: string;
  plot_overview?: string;
  tmdb_id?: number;
  imdb_id?: string;
}
