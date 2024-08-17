import { MovieType } from '@/types/movie/movie.type';
import { ExternalMovieType } from '@/types/movie/external_movie.type';

export class OmdbMovieType extends ExternalMovieType {
  constructor(omdb_movie: OmdbMovieType) {
    super();
    Object.assign(this, omdb_movie);
  }

  Title!: string;
  Year!: string;
  Rated!: string;
  Released!: string;
  Runtime!: string;
  Genre!: string;
  Director!: string;
  Writer!: string;
  Actors!: string;
  Plot!: string;
  Language!: string;
  Country!: string;
  Awards!: string;
  Poster!: string;
  Ratings!: { Source: string; Value: string }[];
  Metascore!: string;
  imdbRating!: string;
  imdbVotes!: string;
  imdbID!: string;
  Type!: string;
  DVD!: string;
  BoxOffice!: string;
  Production!: string;
  Website!: string;
  Response!: string;

  public to_movie_type(): MovieType {
    return new MovieType({
      title: this.Title,
      plot_overview: this.Plot,
      genres: this.Genre.split(', '),
      original_language: this.Language,
      spoken_languages: this.Language.split(', '),
      release_date: this.Released,
      runtime: parseInt(this.Runtime.split(' ')[0]),
      director: this.Director,
      writer: this.Writer,
      actors: this.Actors.split(', '),
      production_companies: this.Production.split(', '),
      production_countries: this.Country.split(', '),
      homepage: this.Website,
      tmdb_id: undefined,
      tmdb_rate: undefined,
      imdb_id: this.imdbID,
      imdb_rate: this.imdbRating,
      metascore: this.Metascore,
      rotten_tomato_rate: this.Ratings.find(
        (rating) => rating.Source === 'Rotten Tomatoes',
      )?.Value,
      poster_path: this.Poster,
    });
  }
}
