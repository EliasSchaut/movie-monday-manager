import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { CtxType } from '@/types/ctx.type';
import { MovieModel } from '@/types/models/movie.model';
import { Movie, MovieMetadata, Prisma } from '@prisma/client';
import { WarningException } from '@/common/exceptions/WarningException';
import { DangerException } from '@/common/exceptions/DangerException';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  async find_by_id(imdb_id: string, ctx: CtxType): Promise<MovieModel> {
    let movie;
    try {
      movie = await this.prisma.movie.findUnique({
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
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new WarningException(ctx.i18n.t('movie.exception.duplication'));
        }
      }
      throw new DangerException(ctx.i18n.t('common.exception.internal'));
    }
    return this.map_to_movie_model(movie!)!;
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

    return movies.map((movie) => this.map_to_movie_model(movie)!);
  }

  private map_to_movie_model(
    movie_item: Movie & { metadata: MovieMetadata[] },
  ): MovieModel | null {
    const metadata = movie_item.metadata[0];
    if (metadata === undefined) return null;

    return {
      imdb_id: movie_item.imdb_id,
      actors: metadata.actors,
      director: metadata.director,
      genre: metadata.genre,
      imdb_link: movie_item.imdb_link,
      imdb_rate: metadata.imdb_rate,
      lang_meta: metadata.lang_meta,
      languages: metadata.languages,
      meta_score: metadata.meta_score,
      plot: metadata.plot,
      poster_link: metadata.poster_link,
      rotten_score: metadata.rotten_score,
      runtime: metadata.runtime,
      title: metadata.title,
      year: metadata.year,
      proposed_at: movie_item.created_at,
    };
  }
}
