import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CtxType } from '@/types/common/ctx.type';
import { WatchlistModel } from '@/types/models/watchlist.model';
import { WatchlistInputModel } from '@/types/models/inputs/watchlist.input';
import { UserModel } from '@/types/models/user.model';
import { WatchlistItemModel } from '@/types/models/watchlist_item.model';
import { WarningException } from '@/common/exceptions/warning.exception';
import { DateService } from '@/common/services/date.service';
import { PrismaException } from '@/common/exceptions/prisma.exception';
import { MovieId } from '@/types/movie/movie_type.utils';
import { MovieService } from '@/graphql/movie/movie.service';

@Injectable()
export class WatchlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly movie_service: MovieService,
  ) {}

  async find(ctx: CtxType): Promise<WatchlistModel> {
    const watchlist = await this.prisma.movieWatchlist.findMany({
      where: {
        server_id: ctx.server_id,
      },
      include: this.include_movie_metadata,
    });

    return new WatchlistModel(watchlist);
  }

  async add_or_update(
    watchlist_input: WatchlistInputModel,
    ctx: CtxType,
  ): Promise<WatchlistItemModel> {
    const movie = await this.movie_service
      .find_by_id_without_metadata(watchlist_input.movie_id, ctx)
      .catch(() => {
        throw new WarningException(
          ctx.i18n.t('watchlist.exception.movie_not_found'),
        );
      });

    const end_time = this.calculate_end_time(
      watchlist_input.start_time,
      movie.runtime,
    );
    const watchlist_item = await this.prisma.movieWatchlist.upsert({
      create: {
        movie: {
          connect: {
            id: watchlist_input.movie_id,
            server_id: ctx.server_id,
          },
        },
        server: {
          connect: {
            id: ctx.server_id,
          },
        },
        start_time: watchlist_input.start_time,
        end_time: end_time,
      },
      where: {
        movie_id_server_id: {
          movie_id: watchlist_input.movie_id,
          server_id: ctx.server_id,
        },
      },
      update: {
        start_time: watchlist_input.start_time,
        end_time: end_time,
      },
      include: this.include_movie_metadata,
    });
    return new WatchlistItemModel(watchlist_item);
  }

  private calculate_end_time(start_time: Date, runtime: number): Date {
    return new DateService(start_time)
      .add_minutes_rounded_to_5(runtime)
      .to_date();
  }

  async delete(movie_id: MovieId, ctx: CtxType): Promise<WatchlistItemModel> {
    const watchlist_item = await this.prisma.movieWatchlist
      .delete({
        where: {
          movie_id_server_id: {
            movie_id: movie_id,
            server_id: ctx.server_id,
          },
        },
        include: this.include_movie_metadata,
      })
      .catch((e: Error) => {
        throw new PrismaException(e, {
          record_does_not_exist: ctx.i18n.t(
            'watchlist.exception.item_not_found',
          ),
        });
      });

    return new WatchlistItemModel(watchlist_item);
  }

  // TODO: Voting System
  async resolve_interested_users(
    movie_id: MovieId,
    ctx: CtxType,
  ): Promise<UserModel[]> {
    return [];
  }

  private include_movie_metadata = {
    movie: {
      include: {
        metadata: true,
      },
    },
  };
}
