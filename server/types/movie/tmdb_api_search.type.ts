import { MovieSearchType } from '@/types/movie/movie_search.type';

export class TmdbApiSearchType {
  constructor(tmdb_movie_search: any) {
    this.id = tmdb_movie_search.id;
    this.title = tmdb_movie_search.title;
    this.plot_overview = tmdb_movie_search.overview;
    this.poster_path = tmdb_movie_search.poster_path;
    this.release_date = tmdb_movie_search.release_date;
    this.tmdb_rate = tmdb_movie_search.vote_average;
  }

  id!: string;
  title!: string;
  plot_overview!: string;
  poster_path!: string;
  release_date!: string;
  tmdb_rate!: number;

  public to_movie_type(): MovieSearchType {
    return this as MovieSearchType;
  }
}
