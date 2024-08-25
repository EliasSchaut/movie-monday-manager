import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CtxType } from '@/types/ctx.type';
import { MovieHistoryModel } from '@/types/models/movie_history.model';
import { MovieHistoryInputModel } from '@/types/models/inputs/movie_history.input';
import { WarningException } from '@/common/exceptions/warning.exception';
import { MovieId } from '@/types/utils/movie_types.util';
import { PrismaException } from '@/common/exceptions/prisma.exception';
import { MovieService } from '@/graphql/movie/movie.service';

@Injectable()
export class HistoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly movie_service: MovieService,
  ) {}

  async find_by_id(movie_id: MovieId, ctx: CtxType) {
    const history_movie = await this.prisma.movieHistory.findUnique({
      where: {
        server_id: ctx.server_id,
        id: movie_id,
      },
      include: {
        metadata: {
          where: {
            lang_meta: ctx.i18n.lang,
          },
          take: 1,
        },
      },
    });
    if (history_movie === null) {
      throw new WarningException(ctx.i18n.t('history.exception.not_found'));
    } else {
      return new MovieHistoryModel(history_movie);
    }
  }

  async find_many(ctx: CtxType): Promise<MovieHistoryModel[]> {
    return (
      await this.prisma.movieHistory.findMany({
        where: {
          server_id: ctx.server_id,
        },
        include: {
          metadata: {
            where: {
              lang_meta: ctx.i18n.lang,
            },
            take: 1,
          },
        },
        orderBy: { watched_at: 'desc' },
      })
    ).map((history_item) => new MovieHistoryModel(history_item));
  }

  async create(
    history_input: MovieHistoryInputModel,
    ctx: CtxType,
  ): Promise<MovieHistoryModel> {
    const movie = await this.movie_service
      .find_by_id_multilang(history_input.movie_id, ctx)
      .catch(() => {
        throw new WarningException(ctx.i18n.t('history.exception.not_found'));
      });
    const createdHistory = await this.prisma.movieHistory
      .create({
        data: {
          server_id: ctx.server_id,
          watched_at: history_input.watched_at ?? undefined,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          tmdb_id: movie.tmdb_id,
          imdb_id: movie.imdb_id,
          metadata: {
            createMany: {
              data: movie.metadata.map((metadata) => {
                return {
                  lang_meta: metadata.lang_meta,
                  title: metadata.title,
                };
              }),
            },
          },
        },
        include: {
          metadata: true,
        },
      })
      .catch((e: Error) => {
        throw new PrismaException(e, {
          unique_constraint_violation: ctx.i18n.t(
            'history.exception.duplication',
          ),
        });
      });

    return new MovieHistoryModel(createdHistory);
  }

  async delete(history_id: MovieId, ctx: CtxType): Promise<MovieHistoryModel> {
    return new MovieHistoryModel(
      await this.prisma.movieHistory.delete({
        where: {
          id: history_id,
          server_id: ctx.server_id,
        },
        include: {
          metadata: true,
        },
      }),
    );
  }
}
