import { MovieType } from '@/types/movie/movie.type';

export class TmdbMovieType {
  constructor(tmdb_movie: TmdbMovieType) {
    Object.assign(this, tmdb_movie);
  }

  adult!: boolean;
  backdrop_path!: string;
  belongs_to_collection!: any;
  budget!: number;
  genres!: { id: number; name: string }[];
  homepage!: string;
  id!: number;
  imdb_id!: string;
  origin_country!: string[];
  original_language!: string;
  original_title!: string;
  overview!: string;
  popularity!: number;
  poster_path!: string;
  production_companies!: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries!: { iso_3166_1: string; name: string }[];
  release_date!: string;
  revenue!: number;
  runtime!: number;
  spoken_languages!: {
    iso_639_1: string;
    english_name: string;
    name: string;
  }[];
  status!: string;
  tagline!: string;
  title!: string;
  video!: boolean;
  vote_average!: number;
  vote_count!: number;
  credits!: {
    id: string;
    cast: {
      adult: boolean;
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: string | null;
      cast_id: number;
      character: string;
      credit_id: string;
      order: number;
    }[];
    crew: {
      adult: boolean;
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: string | null;
      credit_id: string;
      department: string;
      job: string;
    }[];
  };

  to_movie_type(): MovieType {
    return new MovieType({
      actors: this.credits.cast.map((cast) => cast.name),
      adult: this.adult,
      budget: this.budget,
      director:
        this.credits.crew.find((crew) => crew.job === 'Director')?.name ||
        undefined,
      genres: this.genres.map((genre) => genre.name),
      homepage: this.homepage,
      imdb_id: this.imdb_id,
      imdb_rate: undefined,
      original_language: this.original_language,
      original_title: this.original_title,
      plot_overview: this.overview,
      poster_path: this.poster_path,
      production_companies: this.production_companies.map(
        (company) => company.name,
      ),
      production_countries: this.production_countries.map(
        (country) => country.name,
      ),
      release_date: this.release_date,
      revenue: this.revenue,
      rotten_tomato_rate: undefined,
      runtime: this.runtime,
      spoken_languages: this.spoken_languages.map((language) => language.name),
      tagline: this.tagline,
      title: this.title,
      tmdb_id: this.id,
      tmdb_rate: this.vote_average,
      writer:
        this.credits.crew.find((crew) => crew.job === 'Writer')?.name ||
        undefined,
    });
  }
}
