import { Field, ObjectType } from '@nestjs/graphql';
import { MovieSearchItemModel } from '@/types/models/movie_search_item.model';

@ObjectType()
export class MovieSearchModel {
  public static readonly MAX_SEARCH_ITEMS: number = 5;

  constructor(movies_search: MovieSearchItemModel[]) {
    this.items = movies_search;
  }

  @Field(() => [MovieSearchItemModel])
  items!: MovieSearchItemModel[];
}
