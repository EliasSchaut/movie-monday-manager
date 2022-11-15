import { Module } from '@nestjs/common';
import { WatchListDBService } from './watchListDB.service';
import { PrismaService } from "../prisma.service";

@Module({
  providers: [WatchListDBService, PrismaService],
  exports: [WatchListDBService]
})
export class WatchListDBModule {}
