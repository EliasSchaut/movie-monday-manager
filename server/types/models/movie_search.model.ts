import { Field, ObjectType } from '@nestjs/graphql';
import { MovieSearchItemModel } from '@/types/models/movie_search_item.model';

@ObjectType()
export class MovieSearchModel {
  @Field(() => [MovieSearchItemModel])
  items!: MovieSearchItemModel[];
}
