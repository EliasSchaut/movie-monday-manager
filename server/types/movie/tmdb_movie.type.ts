import { MovieType } from '@/types/movie/movie.type';
import { ExternalMovieType } from '@/types/movie/external_movie.type';
import { OmitToMovie } from '@/types/utils/movie_types.util';

export class TmdbMovieType extends ExternalMovieType {
  constructor(tmdb_movie: OmitToMovie<TmdbMovieType>) {
    super();
    Object.assign(this, tmdb_movie);
  }

  id!: number;
  title!: string;
  runtime!: number;

  adult?: boolean | null;
  backdrop_path?: string | null;
  belongs_to_collection?: any | null;
  budget?: number | null;
  genres?: { id: number; name: string }[] | null;
  homepage?: string | null;
  imdb_id?: string | null;
  origin_country?: string[] | null;
  original_language?: string | null;
  original_title?: string | null;
  overview?: string | null;
  popularity?: number | null;
  poster_path?: string | null;
  production_companies?:
    | {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
      }[]
    | null;
  production_countries?: { iso_3166_1: string; name: string }[] | null;
  release_date?: string | null;
  revenue?: number | null;
  spoken_languages?:
    | {
        iso_639_1: string;
        english_name: string;
        name: string;
      }[]
    | null;
  status?: string | null;
  tagline?: string | null;
  video?: boolean | null;
  vote_average?: number | null;
  vote_count?: number | null;
  credits?: {
    id: string;
    cast:
      | {
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
        }[]
      | null;
    crew:
      | {
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
        }[]
      | null;
  };

  public to_movie_type(lang_meta: string): MovieType {
    return new MovieType({
      actors: this.credits?.cast?.map((cast) => cast.name) ?? undefined,
      adult: this.adult ?? undefined,
      budget: this.budget ?? undefined,
      director:
        this.credits?.crew?.find((crew) => crew.job === 'Director')?.name ??
        undefined,
      genres: this.genres?.map((genre) => genre.name) ?? undefined,
      homepage: this.homepage ?? undefined,
      imdb_id: this.imdb_id ?? undefined,
      imdb_rate: undefined,
      original_language: this.original_language ?? undefined,
      original_title: this.original_title ?? undefined,
      plot_overview: this.overview ?? undefined,
      poster_path: this.poster_path ?? undefined,
      production_companies:
        this.production_companies?.map((company) => company.name) ?? undefined,
      production_countries:
        this.production_countries?.map((country) => country.name) ?? undefined,
      release_date: this.release_date ? new Date(this.release_date) : undefined,
      revenue: this.revenue ?? undefined,
      rotten_tomato_rate: undefined,
      runtime: this.runtime,
      spoken_languages:
        this.spoken_languages?.map((language) => language.name) ?? undefined,
      tagline: this.tagline ?? undefined,
      title: this.title,
      tmdb_id: this.id,
      tmdb_rate: this.vote_average ?? undefined,
      writer:
        this.credits?.crew?.find((crew) => crew.job === 'Writer')?.name ??
        undefined,
      lang_meta,
    });
  }
}
