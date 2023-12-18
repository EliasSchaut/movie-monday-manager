import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserModel } from '@/types/models/user.model';

@ObjectType()
export class MovieModel {
  @Field(() => String)
  imdb_id!: string;

  @Field(() => String, {
    description: 'The language of the displayed metadata',
  })
  lang_meta!: string;

  @Field(() => String)
  title!: string;

  @Field(() => Int)
  year!: number;

  @Field(() => Int)
  runtime!: number;

  @Field(() => String)
  imdb_link!: string;

  @Field(() => String, {
    nullable: true,
  })
  genre?: string;

  @Field(() => String, {
    nullable: true,
  })
  director?: string;

  @Field(() => String, {
    nullable: true,
  })
  actors?: string;

  @Field(() => String, {
    nullable: true,
  })
  imdb_rate?: string;

  @Field(() => String, {
    nullable: true,
  })
  meta_score?: string;

  @Field(() => String, {
    nullable: true,
  })
  rotten_score?: string;

  @Field(() => String, {
    nullable: true,
  })
  languages?: string;

  @Field(() => String, {
    nullable: true,
  })
  plot?: string;

  @Field(() => String, {
    nullable: true,
  })
  poster_link?: string;

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
  votes?: number;
}
