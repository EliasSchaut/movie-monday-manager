import { Field, InputType } from '@nestjs/graphql';
import { IsMovieId } from '@/common/validation/decorators/IsMovieId.validation';

@InputType()
export class MovieIdInputModel {
  @IsMovieId()
  @Field(() => String)
  movie_id!: number;
}
