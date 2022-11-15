import { Module } from '@nestjs/common';
import { HistoryDBService } from './historyDB.service';
import { PrismaService } from "../prisma.service";

@Module({
  providers: [HistoryDBService, PrismaService],
  exports: [HistoryDBService]
})
export class HistoryDBModule {}
