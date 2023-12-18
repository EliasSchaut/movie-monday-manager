import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class MovieInputModel {
  imdb_id!: string;

  @Field(() => String, {
    description: 'The language of the displayed metadata',
  })
  lang_meta!: string;

  title!: string;

  @Field(() => Int)
  year!: number;

  genre!: string;

  director!: string;

  actors!: string;

  imdb_rate!: string;

  meta_score!: string;

  rotten_score!: string;

  languages!: string;

  plot!: string;

  @Field(() => Int)
  runtime!: number;

  imdb_link!: string;

  poster_link!: string;

  proposer_id!: string;
}
