import { Resolver } from '@nestjs/graphql';
import { WatchlistService } from '@/graphql/watchlist/watchlist.service';
import { MovieWatchlistModel } from '@/types/models/movie_watchlist.model';

@Resolver(() => MovieWatchlistModel)
export class WatchlistResolver {
  constructor(private readonly watchlist_service: WatchlistService) {}
}
