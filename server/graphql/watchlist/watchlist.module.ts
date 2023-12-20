import { Module } from '@nestjs/common';
import { WatchlistResolver } from '@/graphql/watchlist/watchlist.resolver';
import { WatchlistService } from '@/graphql/watchlist/watchlist.service';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  providers: [WatchlistResolver, WatchlistService, PrismaService],
})
export class WatchlistModule {}
