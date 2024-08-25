import { Field, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import { IsMovieId } from '@/common/validation/decorators/IsMovieId.validation';

@InputType()
export class WatchlistInputModel {
  @IsMovieId()
  @Field(() => String)
  movie_id!: string;

  @IsDate()
  @Field(() => Date)
  start_time!: Date;
}
