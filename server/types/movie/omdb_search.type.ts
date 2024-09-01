import { MovieSearchType } from '@/types/movie/movie_search.type';
import { ExternalSearchType } from '@/types/movie/external_search.type';
import { OmitToMovieSearch } from '@/types/movie/movie_type.utils';

export class OmdbSearchType extends ExternalSearchType {
  constructor(omdb_movie: OmitToMovieSearch<OmdbSearchType>) {
    super();
    Object.assign(this, omdb_movie);
  }

  imdbID!: string;
  Title!: string;

  Year?: string | null;
  Type?: string | null;
  Poster?: string | null;

  public to_movie_search_type(lang_meta: string): MovieSearchType {
    return new MovieSearchType({
      imdb_id: this.imdbID,
      title: this.Title,

      poster_path: this.Poster ?? undefined,
      release_date: this.Year ? new Date(this.Year) : undefined,
      plot_overview: undefined,
      tmdb_id: undefined,
      lang_meta,
    });
  }
}
