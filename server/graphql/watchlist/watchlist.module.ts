import { Module } from '@nestjs/common';
import { WatchlistResolver } from '@/graphql/watchlist/watchlist.resolver';
import { WatchlistService } from '@/graphql/watchlist/watchlist.service';
import { MovieService } from '@/graphql/movie/movie.service';

@Module({
  providers: [WatchlistResolver, WatchlistService, MovieService],
})
export class WatchlistModule {}
