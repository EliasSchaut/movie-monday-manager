import { Module } from '@nestjs/common';
import { WatchlistResolver } from '@/graphql/watchlist/watchlist.resolver';
import { WatchlistService } from '@/graphql/watchlist/watchlist.service';

@Module({
  providers: [WatchlistResolver, WatchlistService],
})
export class WatchlistModule {}
