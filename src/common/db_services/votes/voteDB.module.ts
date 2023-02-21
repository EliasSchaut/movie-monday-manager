import { Module } from '@nestjs/common';
import { VoteDBService } from "@/common/db_services/votes/voteDB.service";
import { PrismaService } from "@/common/db_services/prisma.service";

@Module({
  providers: [VoteDBService, PrismaService],
  exports: [VoteDBService]
})
export class VoteDBModule {}
