import { Field, ObjectType } from '@nestjs/graphql';
import { MovieSearchItemModel } from '@/types/models/movie_search_item.model';
import { MovieSearchType } from '@/types/movie/movie_search.type';

@ObjectType()
export class MovieSearchModel {
  public static readonly MAX_SEARCH_ITEMS: number = Number(
    process.env.MAX_MOVIE_SEARCH_ITEMS,
  );

  constructor(movies_search: MovieSearchType[]) {
    if (movies_search.length > MovieSearchModel.MAX_SEARCH_ITEMS) {
      movies_search = movies_search.slice(0, MovieSearchModel.MAX_SEARCH_ITEMS);
    }
    this.items = movies_search.map(
      (movie_search) => new MovieSearchItemModel(movie_search),
    );
  }

  @Field(() => [MovieSearchItemModel])
  items!: MovieSearchItemModel[];
}
