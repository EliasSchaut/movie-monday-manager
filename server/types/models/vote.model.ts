import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VoteRankEnum } from '@/types/election/vote.enum';
import { MovieVote } from '@prisma/client';
import { IsMovieId } from '@/common/validation/decorators/IsMovieId.validation';
import { MovieId } from '@/types/movie/movie_type.utils';

@ObjectType()
export class VoteModel {
  constructor(vote: MovieVote) {
    this.movie_id = vote.movie_id;
    this.proposer_id = vote.user_id;
    this.rank = vote.rank;
  }

  @IsMovieId()
  @Field(() => String)
  movie_id!: MovieId;

  @Field(() => Int)
  proposer_id!: string;

  @Field(() => Int)
  rank!: VoteRankEnum;
}
