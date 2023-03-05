import { Module } from '@nestjs/common';
import { HistoryDBService } from "@/common/db_services/histroy/historyDB.service";
import { PrismaService } from "@/common/db_services/prisma.service";

@Module({
  providers: [HistoryDBService, PrismaService],
  exports: [HistoryDBService]
})
export class HistoryDBModule {}
