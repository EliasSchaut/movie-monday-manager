import { Field, ObjectType } from '@nestjs/graphql';
import { MovieModel } from '@/types/models/movie.model';
import { UserModel } from '@/types/models/user.model';
import { Movie, MovieMetadata, MovieWatchlist } from '@prisma/client';

2;

@ObjectType()
export class WatchlistItemModel {
  constructor(
    watchlist_item: MovieWatchlist & {
      movie: Movie & { metadata: MovieMetadata[] };
    },
  ) {
    this.movie = new MovieModel(watchlist_item.movie);
    this.start_time = watchlist_item.start_time;
    this.end_time = watchlist_item.end_time;

    // TODO: voting system
    this.interested_users = [];
  }

  @Field(() => MovieModel)
  movie!: MovieModel;

  @Field(() => Date)
  start_time!: Date;

  @Field(() => Date)
  end_time!: Date;

  @Field(() => [UserModel], {
    nullable: true,
  })
  interested_users?: UserModel[];
}
