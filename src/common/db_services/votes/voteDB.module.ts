import { Module } from '@nestjs/common';
import { VoteDBService } from './voteDB.service';
import { PrismaService } from "../prisma.service";

@Module({
  providers: [VoteDBService, PrismaService],
  exports: [VoteDBService]
})
export class VoteDBModule {}
