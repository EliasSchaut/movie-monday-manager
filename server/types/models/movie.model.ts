import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserModel } from '@/types/models/user.model';
import { Movie, MovieMetadata } from '@prisma/client';
import { DangerException } from '@/common/exceptions/danger.exception';
import { I18nContext } from 'nestjs-i18n';

@ObjectType()
export class MovieModel {
  constructor(movie: Movie & { metadata: MovieMetadata[] }) {
    if (movie.metadata.length < 1) {
      throw new DangerException(
        I18nContext.current()!.t('movie.exception.no_metadata'),
      );
    }
    const metadata = movie.metadata[0];

    this.imdb_id = movie.imdb_id;
    this.lang_meta = metadata.lang_meta;
    this.title = metadata.title;
    this.year = movie.year;
    this.runtime = movie.runtime;
    this.imdb_link = movie.imdb_link;
    this.genre = metadata.genre;
    this.director = metadata.director;
    this.actors = metadata.actors;
    this.imdb_rate = metadata.imdb_rate;
    this.meta_score = metadata.meta_score;
    this.rotten_score = metadata.rotten_score;
    this.languages = metadata.languages;
    this.plot = metadata.plot;
    this.poster_link = metadata.poster_link;
    this.proposed_at = movie.proposed_at;
  }

  @Field(() => String)
  imdb_id!: string;

  @Field(() => String, {
    description: 'The language of the displayed metadata',
  })
  lang_meta!: string;

  @Field(() => String)
  imdb_link!: string;

  @Field(() => String)
  title!: string;

  @Field(() => Int)
  year!: number;

  @Field(() => String)
  genre?: string;

  @Field(() => Int)
  runtime!: number;

  @Field(() => String, {
    nullable: true,
  })
  director?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  actors?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  imdb_rate?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  meta_score?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  rotten_score?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  languages?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  plot?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  poster_link?: string | null;

  @Field(() => UserModel, {
    nullable: true,
  })
  proposer?: UserModel;

  @Field(() => Date, {
    nullable: true,
  })
  proposed_at?: Date;

  @Field(() => Int, {
    nullable: true,
  })
  rank?: number;
}
