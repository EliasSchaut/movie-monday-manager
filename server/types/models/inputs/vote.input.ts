import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { VoteRankEnum } from '@/types/election/vote.enum';
import { MovieId } from '@/types/movie/movie_type.utils';
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
