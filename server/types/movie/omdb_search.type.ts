import { MovieSearchType } from '@/types/movie/movie_search.type';
import { ExternalSearchType } from '@/types/movie/external_search.type';

export class OmdbSearchType extends ExternalSearchType {
  constructor(omdb_movie: OmdbSearchType) {
    super();
    Object.assign(this, omdb_movie);
  }

  Title!: string;
  Year!: string;
  imdbID!: string;
  Type!: string;
  Poster!: string;

  public to_movie_search_type(): MovieSearchType {
    return new MovieSearchType({
      title: this.Title,
      poster_path: this.Poster,
      release_date: this.Year,
      plot_overview: undefined,
      tmdb_id: undefined,
      imdb_id: this.imdbID,
    });
  }
}
