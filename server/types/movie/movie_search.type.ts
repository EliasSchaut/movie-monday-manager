import { ExternalSearchType } from '@/types/movie/external_search.type';
import { OmitToMovieSearch } from '@/types/utils/movie.util';

export class MovieSearchType extends ExternalSearchType {
  constructor(searches: OmitToMovieSearch<MovieSearchType>) {
    super();
    Object.assign(this, searches);
  }

  title!: string;
  poster_path!: string;
  release_date!: string;
  plot_overview?: string;
  tmdb_id?: number;
  imdb_id?: string;

  public to_movie_search_type(): MovieSearchType {
    return this;
  }
}
