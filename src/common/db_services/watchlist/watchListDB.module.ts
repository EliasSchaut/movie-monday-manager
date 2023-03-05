import { Module } from '@nestjs/common';
import { WatchListDBService } from "@/common/db_services/watchlist/watchListDB.service";
import { PrismaService } from "@/common/db_services/prisma.service";

@Module({
  providers: [WatchListDBService, PrismaService],
  exports: [WatchListDBService]
})
export class WatchListDBModule {}
