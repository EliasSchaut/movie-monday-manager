import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CtxType } from '@/types/ctx.type';
import { MovieHistoryModel } from '@/types/models/movie_history.model';
import { MovieHistoryInputModel } from '@/types/models/inputs/movie_history.input';
import { MovieMetadata, Prisma } from '@prisma/client';
import { WarningException } from '@/common/exceptions/warning.exception';
import { ImdbApiService } from '@/common/services/imdb_api.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async find_by_id(imdb_id: string, ctx: CtxType) {
    const history_movie = await this.prisma.movieHistory.findUnique({
      where: {
        imdb_id_server_id: {
          server_id: ctx.server_id,
          imdb_id: imdb_id,
        },
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
    history_item: MovieHistoryInputModel,
    ctx: CtxType,
  ): Promise<MovieHistoryModel> {
    const movie_title_multilang = await this.find_movie_metadata_multilang(
      history_item.imdb_id,
      ctx,
    );
    const createdHistory = await this.prisma.movieHistory
      .create({
        data: {
          server_id: ctx.server_id,
          imdb_id: history_item.imdb_id,
          watched_at: history_item.watched_at ?? undefined,
          imdb_link: ImdbApiService.gen_imdb_link(history_item.imdb_id),
          metadata: {
            createMany: {
              data: movie_title_multilang.map((metadata) => {
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
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          throw new WarningException(
            ctx.i18n.t('history.exception.duplication'),
          );
        }
        throw e;
      });

    return new MovieHistoryModel(createdHistory);
  }

  async delete(imdb_id: string, ctx: CtxType): Promise<MovieHistoryModel> {
    return new MovieHistoryModel(
      await this.prisma.movieHistory.delete({
        where: {
          imdb_id_server_id: {
            imdb_id: imdb_id,
            server_id: ctx.server_id,
          },
        },
        include: {
          metadata: true,
        },
      }),
    );
  }

  private async find_movie_metadata_multilang(
    imdb_id: string,
    ctx: CtxType,
  ): Promise<MovieMetadata[]> {
    return (await this.prisma.movie.findUnique({
      where: {
        imdb_id_server_id: {
          server_id: ctx.server_id,
          imdb_id: imdb_id,
        },
      },
      include: {
        metadata: true,
      },
    }))!.metadata;
  }
}
