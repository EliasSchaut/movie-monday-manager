import { Field, ObjectType } from '@nestjs/graphql';
import { MovieHistory, MovieHistoryMetadata } from '@prisma/client';

@ObjectType()
export class MovieHistoryModel {
  @Field(() => String)
  imdb_id!: string;

  @Field(() => String)
  lang_meta!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  imdb_link!: string;

  @Field(() => Date)
  watched_at!: Date;

  constructor(
    history_item: MovieHistory & { metadata: MovieHistoryMetadata[] },
  ) {
    this.imdb_id = history_item.imdb_id;
    this.lang_meta = history_item.metadata[0]?.lang_meta || 'en';
    this.title = history_item.metadata[0]?.title || '';
    this.imdb_link = history_item.imdb_link;
    this.watched_at = history_item.watched_at;
  }
}
