import { Field, ObjectType } from '@nestjs/graphql';
import { MovieModel } from '@/types/models/movie.model';

@ObjectType()
export class MovieWatchlistModel {
  @Field(() => [MovieModel])
  items!: MovieModel[];
}
