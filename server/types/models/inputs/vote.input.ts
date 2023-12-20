import { Field, InputType, Int } from '@nestjs/graphql';
import { IsImdbId } from '@/common/validation/decorators/IsImdbId.validation';
import { Max, Min } from 'class-validator';
import { VoteRankEnum } from '@/types/enums/vote.enum';

@InputType()
export class VoteInputModel {
  @IsImdbId()
  @Field(() => String)
  imdb_id!: string;

  @Min(1)
  @Max(5)
  @Field(() => Int)
  rank!: VoteRankEnum;
}
