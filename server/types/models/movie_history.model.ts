import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MovieHistory, MovieHistoryMetadata } from '@prisma/client';
import { ImdbId, TmdbId } from '@/types/utils/movie.util';

@ObjectType()
export class MovieHistoryModel {
  constructor(history: MovieHistory & { metadata: MovieHistoryMetadata[] }) {
    const meta = history.metadata[0];

    this.id = history.id;
    this.lang_meta = meta.lang_meta;
    this.watched_at = history.watched_at;
    this.title = meta.title;
    this.poster_path = history.poster_path ?? undefined;
    this.release_date = history.release_date ?? undefined;
    this.plot_overview = meta.plot_overview ?? undefined;
    this.tmdb_id = history.tmdb_id ?? undefined;
    this.imdb_id = history.imdb_id ?? undefined;
  }

  @Field(() => Int)
  id!: number;

  @Field(() => String)
  lang_meta!: string;

  @Field(() => Date)
  watched_at!: Date;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  poster_path?: string;

  @Field(() => String, { nullable: true })
  release_date?: Date;

  @Field(() => String, { nullable: true })
  plot_overview?: string;

  @Field(() => Int, { nullable: true })
  tmdb_id?: TmdbId;

  @Field(() => String, { nullable: true })
  imdb_id?: ImdbId;
}
