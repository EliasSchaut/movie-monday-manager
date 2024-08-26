import { ExternalSearchType } from '@/types/movie/external_search.type';
import { OmitToMovieSearch } from '@/types/utils/movie_types.util';

export class MovieSearchType extends ExternalSearchType {
  constructor(searches: OmitToMovieSearch<MovieSearchType>) {
    super();
    Object.assign(this, searches);
  }

  title!: string;
  poster_path?: string;
  release_date?: Date;
  plot_overview?: string;
  tmdb_id?: number;
  imdb_id?: string;

  // Internal Information
  lang_meta!: string;

  public to_movie_search_type(lang_meta: string): MovieSearchType {
    this.lang_meta = lang_meta;
    return this;
  }
}
