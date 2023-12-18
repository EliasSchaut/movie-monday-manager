import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { CtxType } from '@/types/ctx.type';
import { MovieHistoryModel } from '@/types/models/movie_history.model';
import { MovieHistoryInputModel } from '@/types/models/inputs/movie_history.input';
import { MovieMetadata } from '@prisma/client';
import { WarningException } from '@/common/exceptions/WarningException';
import { ImdbApiService } from '@/common/services/imdb_api.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async get(imdb_id: string, ctx: CtxType) {
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

  async get_all(ctx: CtxType): Promise<MovieHistoryModel[]> {
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

  async add(
    history_item: MovieHistoryInputModel,
    ctx: CtxType,
  ): Promise<MovieHistoryModel> {
    if (await this.get(history_item.imdb_id, ctx)) {
      throw new WarningException(ctx.i18n.t('history.exception.duplication'));
    }

    const movie_title_multilang = await this.find_movie_titles_multilang(
      history_item.imdb_id,
      ctx,
    );
    const createdHistory = await this.prisma.movieHistory.create({
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

  private async find_movie_titles_multilang(
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
