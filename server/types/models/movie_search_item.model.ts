import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({
  description: 'Movie with reduced information as on result of a search query',
})
export class MovieSearchItemModel {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String)
  imdb_id!: string;

  @Field(() => String, {
    nullable: true,
  })
  poster_link?: string;
}
