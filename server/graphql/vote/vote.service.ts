import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CtxType } from '@/types/ctx.type';
import { VoteInputModel } from '@/types/models/inputs/vote.input';
import { VoteModel } from '@/types/models/vote.model';
import { WarningException } from '@/common/exceptions/warning.exception';
import { MovieVote } from '@prisma/client';
import { MovieId } from '@/types/utils/movie_types.util';

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}

  async find_by_id_user(movie_id: MovieId, ctx: CtxType): Promise<VoteModel> {
    const vote: MovieVote | null = await this.prisma.movieVote.findUnique({
      where: {
        movie_id_server_id_user_id: {
          user_id: ctx.user_id!,
          server_id: ctx.server_id,
          movie_id: movie_id,
        },
      },
    });

    if (!vote) {
      throw new WarningException(ctx.i18n.t('vote.exception.not_found'));
    }

    return new VoteModel(vote);
  }

  async find_many_user(ctx: CtxType): Promise<VoteModel[]> {
    const votes: MovieVote[] = await this.prisma.movieVote.findMany({
      where: {
        user_id: ctx.user_id,
        server_id: ctx.server_id,
      },
    });

    return votes.map((vote: MovieVote) => new VoteModel(vote));
  }

  async create_or_update(
    vote_input: VoteInputModel,
    ctx: CtxType,
  ): Promise<VoteModel> {
    const vote: MovieVote = await this.prisma.movieVote.upsert({
      create: {
        rank: vote_input.rank.valueOf(),
        server: {
          connect: {
            id: ctx.server_id,
          },
        },
        movie: {
          connect: {
            server_id: ctx.server_id,
            id: vote_input.movie_id,
          },
        },
        user: {
          connect: {
            id: ctx.user_id,
          },
        },
      },
      where: {
        movie_id_server_id_user_id: {
          user_id: ctx.user_id!,
          server_id: ctx.server_id,
          movie_id: vote_input.movie_id,
        },
      },
      update: {
        rank: vote_input.rank.valueOf(),
      },
    });
    return new VoteModel(vote);
  }

  async delete(movie_id: MovieId, ctx: CtxType): Promise<VoteModel> {
    const vote = await this.prisma.movieVote.delete({
      where: {
        movie_id_server_id_user_id: {
          user_id: ctx.user_id!,
          server_id: ctx.server_id,
          movie_id: movie_id,
        },
      },
    });

    return new VoteModel(vote);
  }
}
