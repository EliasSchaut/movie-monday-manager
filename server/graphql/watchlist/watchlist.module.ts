import { Module } from '@nestjs/common';
import { WatchlistResolver } from '@/graphql/watchlist/watchlist.resolver';
import { WatchlistService } from '@/graphql/watchlist/watchlist.service';
import { MovieModule } from '@/graphql/movie/movie.module';

@Module({
  imports: [MovieModule],
  providers: [WatchlistResolver, WatchlistService],
})
export class WatchlistModule {}
