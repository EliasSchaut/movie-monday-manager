import { MovieType } from '@/types/movie/movie.type';
import { ExternalMovieType } from '@/types/movie/external_movie.type';
import { OmitToMovie } from '@/types/movie/movie_type.utils';

export class OmdbMovieType extends ExternalMovieType {
  constructor(omdb_movie: OmitToMovie<OmdbMovieType>) {
    super();
    Object.assign(this, omdb_movie);
  }

  imdbID!: string;
  Title!: string;
  Runtime!: string;

  Year?: string | null;
  Rated?: string | null;
  Released?: string | null;
  Genre?: string | null;
  Director?: string | null;
  Writer?: string | null;
  Actors?: string | null;
  Plot?: string | null;
  Language?: string | null;
  Country?: string | null;
  Awards?: string | null;
  Poster?: string | null;
  Ratings?: { Source: string; Value: string }[] | null;
  Metascore?: string | null;
  imdbRating?: string | null;
  imdbVotes?: string | null;
  Type?: string | null;
  DVD?: string | null;
  BoxOffice?: string | null;
  Production?: string | null;
  Website?: string | null;
  Response?: string | null;

  public to_movie_type(lang_meta: string): MovieType {
    return new MovieType({
      imdb_id: this.imdbID,
      title: this.Title,
      runtime: Number(this.Runtime.split(' ')[0]),

      plot_overview: this.Plot ?? undefined,
      genres: this.Genre ? this.Genre.split(', ') : [],
      original_language: this.Language ?? undefined,
      spoken_languages: this.Language ? this.Language.split(', ') : [],
      release_date: this.Released ? new Date(this.Released) : undefined,
      director: this.Director ?? undefined,
      writer: this.Writer ?? undefined,
      actors: this.Actors ? this.Actors.split(', ') : undefined,
      production_companies: this.Production ? this.Production.split(', ') : [],
      production_countries: this.Country ? this.Country.split(', ') : [],
      homepage: this.Website ?? undefined,
      tmdb_id: undefined,
      tmdb_rate: undefined,
      imdb_rate: this.imdbRating ?? undefined,
      metascore: this.Metascore ?? undefined,
      rotten_tomato_rate: this.Ratings
        ? this.Ratings?.find((rating) => rating.Source === 'Rotten Tomatoes')
            ?.Value
        : undefined,
      poster_path: this.Poster ?? undefined,
      lang_meta,
    });
  }
}
