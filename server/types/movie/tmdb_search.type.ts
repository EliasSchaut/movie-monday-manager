import { MovieSearchType } from '@/types/movie/movie_search.type';
import { ExternalSearchType } from '@/types/movie/external_search.type';
import { OmitToMovieSearch } from '@/types/utils/movie_types.util';

export class TmdbSearchType extends ExternalSearchType {
  constructor(tmdb_movie_search: OmitToMovieSearch<TmdbSearchType>) {
    super();
    Object.assign(this, tmdb_movie_search);
  }

  id!: number;
  title!: string;

  adult?: boolean | null;
  backdrop_path?: string | null;
  genre_ids?: number[] | null;
  original_language?: string | null;
  original_title?: string | null;
  overview?: string | null;
  popularity?: number | null;
  poster_path?: string | null;
  release_date?: string | null;
  video?: boolean | null;
  vote_average?: number | null;
  vote_count?: number | null;

  public to_movie_search_type(lang_meta: string): MovieSearchType {
    return new MovieSearchType({
      title: this.title,
      plot_overview: this.overview ?? undefined,
      poster_path: this.poster_path ?? undefined,
      release_date: this.release_date ? new Date(this.release_date) : undefined,
      tmdb_id: this.id,
      imdb_id: undefined,
      lang_meta,
    });
  }
}
