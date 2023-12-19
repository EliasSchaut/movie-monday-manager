import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { CtxType } from '@/types/ctx.type';
import { MovieModel } from '@/types/models/movie.model';
import { WarningException } from '@/common/exceptions/warning.exception';
import { UserModel } from '@/types/models/user.model';
import { ImdbApiService } from '@/common/services/imdb_api.service';
import { Prisma } from '@prisma/client';
import { PrismaException } from '@/common/exceptions/prisma.exception';
import { MovieSearchModel } from '@/types/models/movie_search.model';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imdb_api_service: ImdbApiService,
  ) {}

  async find_by_id(imdb_id: string, ctx: CtxType): Promise<MovieModel> {
    const movie = await this.prisma.movie.findUnique({
      where: {
        imdb_id_server_id: { imdb_id: imdb_id, server_id: ctx.server_id },
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

    if (movie === null)
      throw new WarningException(ctx.i18n.t('movie.exception.not_found'));
    return new MovieModel(movie);
  }

  async find_many(ctx: CtxType): Promise<MovieModel[]> {
    const movies = await this.prisma.movie.findMany({
      where: { server_id: ctx.server_id },
      include: {
        metadata: {
          where: {
            lang_meta: ctx.i18n.lang,
          },
          take: 1,
        },
      },
    });

    return movies.map((movie) => new MovieModel(movie));
  }

  async search(search_query: string, ctx: CtxType): Promise<MovieSearchModel> {
    return await this.imdb_api_service.search(search_query, ctx.i18n.lang);
  }

  async create(imdb_id: string, ctx: CtxType): Promise<MovieModel> {
    const api_movies = await this.imdb_api_service.find_all_langs(imdb_id);
    if (api_movies === null || api_movies.length === 0)
      throw new WarningException(
        ctx.i18n.t('movie.exception.create_api_not_found'),
      );

    const movie = await this.prisma.movie
      .create({
        data: {
          imdb_id: imdb_id,
          server_id: ctx.server_id,
          proposer_id: ctx.user_id!,
          imdb_link: ImdbApiService.gen_imdb_link(imdb_id),
          metadata: {
            createMany: {
              data: api_movies as Prisma.MovieMetadataCreateManyMovieInput[],
            },
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
      })
      .catch((e: Error) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          throw new WarningException(ctx.i18n.t('movie.exception.duplication'));
        }
        throw e;
      });
    return new MovieModel(movie);
  }

  async delete(imdb_id: string, ctx: CtxType) {
    const movie = await this.prisma.movie
      .delete({
        where: {
          imdb_id_server_id: {
            imdb_id: imdb_id,
            server_id: ctx.server_id,
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
      })
      .catch((e: Error) => {
        throw new PrismaException(e, {
          record_does_not_exist: ctx.i18n.t('movie.exception.not_found'),
        });
      });
    return new MovieModel(movie);
  }

  async delete_proposed(imdb_id: string, ctx: CtxType): Promise<MovieModel> {
    const movie = await this.prisma.movie
      .delete({
        where: {
          imdb_id_server_id: {
            imdb_id: imdb_id,
            server_id: ctx.server_id,
          },
          proposer_id: ctx.user_id,
        },
        include: {
          metadata: {
            where: {
              lang_meta: ctx.i18n.lang,
            },
            take: 1,
          },
        },
      })
      .catch((e: Error) => {
        throw new PrismaException(e, {
          record_does_not_exist: ctx.i18n.t(
            'movie.exception.not_found_or_proposed',
          ),
        });
      });
    return new MovieModel(movie);
  }

  async resolve_proposer(imdb_id: string, ctx: CtxType): Promise<UserModel> {
    const movie = await this.prisma.movie.findUnique({
      where: {
        imdb_id_server_id: {
          imdb_id: imdb_id,
          server_id: ctx.server_id,
        },
      },
      include: {
        proposer: true,
      },
    });
    if (movie === null)
      throw new WarningException(ctx.i18n.t('movie.exception.not_found'));
    return new UserModel(movie.proposer).convert_to_public();
  }

  // TODO: Implement vote system
  async resolve_votes(imdb_id: string, ctx: CtxType) {
    return 0;
  }
}
