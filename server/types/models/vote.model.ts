import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VoteRankEnum } from '@/types/enums/vote.enum';
import { MovieVote } from '@prisma/client';

@ObjectType()
export class VoteModel {
  constructor(vote: MovieVote) {
    this.imdb_id = vote.imdb_id;
    this.proposer_id = vote.user_id;
    this.rank = vote.rank;
  }

  @Field(() => String)
  imdb_id!: string;

  @Field(() => Int)
  proposer_id!: string;

  @Field(() => Int)
  rank!: VoteRankEnum;
}
