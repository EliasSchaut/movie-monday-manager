import { Field, ObjectType } from '@nestjs/graphql';
import { WatchlistItemModel } from '@/types/models/watchlist_item.model';
import { Movie, MovieMetadata, MovieWatchlist } from '@prisma/client';

@ObjectType()
export class WatchlistModel {
  constructor(
    watchlist: (MovieWatchlist & {
      movie: Movie & { metadata: MovieMetadata[] };
    })[],
  ) {
    this.items = watchlist.map((item) => new WatchlistItemModel(item));
  }

  @Field(() => [WatchlistItemModel])
  items!: WatchlistItemModel[];
}
