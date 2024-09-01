import { Field, InputType } from '@nestjs/graphql';
import { MovieId } from '@/types/movie/movie_type.utils';
import { IsMovieId } from '@/common/validation/decorators/IsMovieId.validation';
import { IsDate } from 'class-validator';

@InputType()
export class MovieHistoryInputModel {
  @IsMovieId()
  @Field(() => String)
  movie_id!: MovieId;

  @IsDate()
  @Field(() => Date, {
    defaultValue: new Date(),
    nullable: true,
  })
  watched_at?: Date;
}
