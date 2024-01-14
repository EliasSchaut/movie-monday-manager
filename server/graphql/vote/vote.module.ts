import { Module } from '@nestjs/common';
import { VoteResolver } from '@/graphql/vote/vote.resolver';
import { VoteService } from '@/graphql/vote/vote.service';

@Module({
  providers: [VoteResolver, VoteService],
})
export class VoteModule {}
