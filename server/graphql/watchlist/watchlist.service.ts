import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CtxType } from '@/types/ctx.type';
import { WatchlistModel } from '@/types/models/watchlist.model';
import { WatchlistInputModel } from '@/types/models/inputs/watchlist.input';
import { UserModel } from '@/types/models/user.model';
import { WatchlistItemModel } from '@/types/models/watchlist_item.model';
import { WarningException } from '@/common/exceptions/warning.exception';
import { DateService } from '@/common/services/date.service';
import { PrismaException } from '@/common/exceptions/prisma.exception';

@Injectable()
export class WatchlistService {
  private args_include = {
    movie: {
      include: {
        metadata: true,
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async find(ctx: CtxType): Promise<WatchlistModel> {
    const watchlist = await this.prisma.movieWatchlist.findMany({
      where: {
        server_id: ctx.server_id,
      },
      include: this.args_include,
    });

    return new WatchlistModel(watchlist);
  }

  async add_or_update(
    watchlist_input: WatchlistInputModel,
    ctx: CtxType,
  ): Promise<WatchlistItemModel> {
    const movie = await this.prisma.movie.findUnique({
      select: {
        runtime: true,
      },
      where: {
        imdb_id_server_id: {
          imdb_id: watchlist_input.imdb_id,
          server_id: ctx.server_id,
        },
      },
    });
    if (!movie) {
      throw new WarningException(
        ctx.i18n.t('watchlist.exception.movie_not_found'),
      );
    }

    const end_time = new DateService(watchlist_input.start_time)
      .add_minutes_rounded_to_5(movie.runtime)
      .to_date();

    const watchlist_item = await this.prisma.movieWatchlist.upsert({
      create: {
        movie: {
          connect: {
            imdb_id_server_id: {
              imdb_id: watchlist_input.imdb_id,
              server_id: ctx.server_id,
            },
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
        imdb_id_server_id: {
          imdb_id: watchlist_input.imdb_id,
          server_id: ctx.server_id,
        },
      },
      update: {
        start_time: watchlist_input.start_time,
        end_time: end_time,
      },
      include: this.args_include,
    });
    return new WatchlistItemModel(watchlist_item);
  }

  async delete(imdb_id: string, ctx: CtxType): Promise<WatchlistItemModel> {
    const watchlist_item = await this.prisma.movieWatchlist
      .delete({
        where: {
          imdb_id_server_id: {
            imdb_id: imdb_id,
            server_id: ctx.server_id,
          },
        },
        include: this.args_include,
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
    imdb_id: string,
    ctx: CtxType,
  ): Promise<UserModel[]> {
    return [];
  }
}
