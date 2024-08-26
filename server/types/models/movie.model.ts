import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Movie, MovieMetadata } from '@prisma/client';
import { DangerException } from '@/common/exceptions/danger.exception';
import { I18nContext } from 'nestjs-i18n';
import { MovieType } from '@/types/movie/movie.type';
import { OmitToMovie } from '@/types/utils/movie_types.util';

@ObjectType()
export class MovieModel implements OmitToMovie<MovieType> {
  constructor(movie: Movie & { metadata?: MovieMetadata[] }) {
    if (movie.metadata) {
      if (movie.metadata.length < 1) {
        throw new DangerException(
          I18nContext.current()!.t('movie.exception.no_metadata'),
        );
      }
      const meta = movie.metadata[0];

      this.title = meta.title;
      this.tagline = meta.tagline ?? undefined;
      this.plot_overview = meta.plot_overview ?? undefined;
      this.genres = meta.genres;
      this.original_language = meta.original_language ?? undefined;
      this.spoken_languages = meta.spoken_languages;
      this.director = meta.director ?? undefined;
      this.writer = meta.writer ?? undefined;
      this.actors = meta.actors;
      this.production_companies = meta.production_companies;
      this.production_countries = meta.production_countries;
      this.lang_meta = meta.lang_meta;
    }

    this.id = movie.id;
    this.original_title = movie.original_title ?? undefined;
    this.release_date = movie.release_date
      ? new Date(movie.release_date)
      : undefined;
    this.runtime = movie.runtime;
    this.adult = movie.adult ?? undefined;
    this.budget = movie.budget ?? undefined;
    this.revenue = movie.revenue ?? undefined;
    this.homepage = movie.homepage ?? undefined;
    this.tmdb_id = movie.tmdb_id ?? undefined;
    this.tmdb_rate = movie.tmdb_rate ?? undefined;
    this.imdb_id = movie.imdb_id ?? undefined;
    this.imdb_rate = movie.imdb_rate ?? undefined;
    this.metascore = movie.metascore ?? undefined;
    this.rotten_tomato_rate = movie.rotten_tomato_rate ?? undefined;
    this.poster_path = movie.poster_path ?? undefined;
  }

  // Internal Information
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  lang_meta!: string;

  // Basic Information
  @Field(() => String)
  title!: string;

  @Field(() => Int)
  runtime!: number;

  @Field(() => String, { nullable: true })
  original_title?: string;

  @Field(() => String, { nullable: true })
  tagline?: string;

  @Field(() => String, { nullable: true })
  plot_overview?: string;

  @Field(() => [String], { nullable: true })
  genres!: string[];

  @Field(() => String, { nullable: true })
  original_language?: string;

  @Field(() => [String], { nullable: true })
  spoken_languages!: string[];

  @Field(() => String, { nullable: true })
  release_date?: Date;

  @Field(() => Boolean, { nullable: true })
  adult?: boolean;

  // Production Information
  @Field(() => String, { nullable: true })
  director?: string;

  @Field(() => String, { nullable: true })
  writer?: string;

  @Field(() => [String], { nullable: true })
  actors?: string[];

  @Field(() => [String], { nullable: true })
  production_companies!: string[];

  @Field(() => [String], { nullable: true })
  production_countries!: string[];

  @Field(() => Int, { nullable: true })
  budget?: number;

  @Field(() => Int, { nullable: true })
  revenue?: number;

  @Field(() => String, { nullable: true })
  homepage?: string;

  // Identifiers and Ratings
  @Field(() => Int, { nullable: true })
  tmdb_id?: number;

  @Field(() => Int, { nullable: true })
  tmdb_rate?: number;

  @Field(() => String, { nullable: true })
  imdb_id?: string;

  @Field(() => String, { nullable: true })
  imdb_rate?: string;

  @Field(() => String, { nullable: true })
  metascore?: string;

  @Field(() => String, { nullable: true })
  rotten_tomato_rate?: string;

  // Media Information
  @Field(() => String, { nullable: true })
  poster_path?: string;
}
