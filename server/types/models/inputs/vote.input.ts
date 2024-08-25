import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { VoteRankEnum } from '@/types/enums/vote.enum';
import { MovieId } from '@/types/utils/movie.util';
import { IsMovieId } from '@/common/validation/decorators/IsMovieId.validation';

@InputType()
export class VoteInputModel {
  @IsMovieId()
  @Field(() => String)
  movie_id!: MovieId;

  @Min(1)
  @Max(5)
  @Field(() => Int)
  rank!: VoteRankEnum;
}
