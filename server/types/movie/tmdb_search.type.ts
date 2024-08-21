import { MovieSearchType } from '@/types/movie/movie_search.type';
import { ExternalSearchType } from '@/types/movie/external_search.type';
import { OmitToMovieSearch } from '@/types/utils/movie.util';

export class TmdbSearchType extends ExternalSearchType {
  constructor(tmdb_movie_search: OmitToMovieSearch<TmdbSearchType>) {
    super();
    Object.assign(this, tmdb_movie_search);
  }

  adult!: boolean;
  backdrop_path!: string;
  genre_ids!: number[];
  id!: number;
  original_language!: string;
  original_title!: string;
  overview!: string;
  popularity!: number;
  poster_path!: string;
  release_date!: string;
  title!: string;
  video!: boolean;
  vote_average!: number;
  vote_count!: number;

  public to_movie_search_type(): MovieSearchType {
    return new MovieSearchType({
      title: this.title,
      plot_overview: this.overview,
      poster_path: this.poster_path,
      release_date: this.release_date,
      tmdb_id: this.id,
      imdb_id: undefined,
    });
  }
}
