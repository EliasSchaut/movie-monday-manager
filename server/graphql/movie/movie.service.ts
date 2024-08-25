import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CtxType } from '@/types/ctx.type';
import { MovieModel } from '@/types/models/movie.model';
import { WarningException } from '@/common/exceptions/warning.exception';
import { UserModel } from '@/types/models/user.model';
import { Movie, MovieMetadata, Prisma } from '@prisma/client';
import { PrismaException } from '@/common/exceptions/prisma.exception';
import { MovieSearchModel } from '@/types/models/movie_search.model';
import { MovieApiService } from '@/common/services/movie_api/movie_api.service';
import { MovieType } from '@/types/movie/movie.type';
import { MovieExternalIdsType, MovieId } from '@/types/utils/movie_types.util';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly movie_api_service: MovieApiService,
  ) {}

  async find_by_id(movie_id: MovieId, ctx: CtxType): Promise<MovieModel> {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movie_id,
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
    });

    if (movie === null)
      throw new WarningException(ctx.i18n.t('movie.exception.not_found'));
    return new MovieModel(movie);
  }

  async find_by_id_without_metadata(
    movie_id: MovieId,
    ctx: CtxType,
  ): Promise<MovieModel> {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movie_id,
        server_id: ctx.server_id,
      },
    });

    if (movie === null)
      throw new WarningException(ctx.i18n.t('movie.exception.not_found'));
    return new MovieModel(movie);
  }

  async find_by_id_multilang(
    movie_id: MovieId,
    ctx: CtxType,
  ): Promise<Movie & { metadata: MovieMetadata[] }> {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movie_id,
        server_id: ctx.server_id,
      },
      include: {
        metadata: true,
      },
    });
    if (movie === null)
      throw new WarningException(ctx.i18n.t('movie.exception.not_found'));
    return movie;
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
    const searches = await this.movie_api_service.search(
      search_query,
      ctx.i18n.lang,
    );
    return new MovieSearchModel(searches);
  }

  async create(
    external_id: MovieExternalIdsType,
    ctx: CtxType,
  ): Promise<MovieModel> {
    const api_movies: MovieType[] = [];
    for (const lang of ctx.i18n.service.getSupportedLanguages()) {
      const api_movie = await this.movie_api_service.find(external_id, lang);
      if (!api_movie)
        throw new WarningException(
          ctx.i18n.t('movie.exception.create_api_not_found'),
        );
      api_movies.push(api_movie);
    }

    const lang_independent_metadata = api_movies[0];
    const movie = await this.prisma.movie
      .create({
        data: {
          server_id: ctx.server_id,
          proposer_id: ctx.user_id!,
          ...lang_independent_metadata,
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
        throw new PrismaException(e, {
          unique_constraint_violation: ctx.i18n.t(
            'movie.exception.duplication',
          ),
        });
      });
    return new MovieModel(movie);
  }

  async delete(movie_id: MovieId, ctx: CtxType) {
    const movie = await this.prisma.movie
      .delete({
        where: { id: movie_id, server_id: ctx.server_id },
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

  async delete_proposed(movie_id: MovieId, ctx: CtxType): Promise<MovieModel> {
    const movie = await this.prisma.movie
      .delete({
        where: {
          id: movie_id,
          server_id: ctx.server_id,
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

  async resolve_proposer(movie_id: MovieId, ctx: CtxType): Promise<UserModel> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movie_id, server_id: ctx.server_id },
      include: {
        proposer: true,
      },
    });
    if (movie === null)
      throw new WarningException(ctx.i18n.t('movie.exception.not_found'));
    return new UserModel(movie.proposer).convert_to_public();
  }

  // TODO: Implement rank system
  async resolve_rank(movie_id: MovieId, ctx: CtxType): Promise<number> {
    return 1;
  }
}
