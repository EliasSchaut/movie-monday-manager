import { Field, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import { IsMovieId } from '@/common/validation/decorators/IsMovieId.validation';
import { MovieId } from '@/types/movie/movie_type.utils';

@InputType()
export class WatchlistInputModel {
  @IsMovieId()
  @Field(() => String)
  movie_id!: MovieId;

  @IsDate()
  @Field(() => Date)
  start_time!: Date;
}
