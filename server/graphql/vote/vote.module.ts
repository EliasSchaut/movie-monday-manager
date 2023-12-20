import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { VoteResolver } from '@/graphql/vote/vote.resolver';
import { VoteService } from '@/graphql/vote/vote.service';

@Module({
  providers: [VoteResolver, VoteService, PrismaService],
})
export class VoteModule {}
