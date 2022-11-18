import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class VoteDBService {

  constructor(private readonly prisma: PrismaService) {}

  async get(data : Prisma.VoteWhereUniqueInput) {
    return await this.prisma.vote.findUnique({
      where: data,
    });
  }

  async has(user_id: Prisma.UserWhereUniqueInput, imdb_id: Prisma.MovieWhereUniqueInput) {
    return await this.prisma.vote.findFirst({
      where: {
        user: user_id,
        movie: imdb_id
      }
    })
  }

  async num_of(user_id: number) {
    return await this.prisma.vote.count({
      where: {
        user: { id: user_id }
      }
    })
  }

  async get_num_of_votes(imdb_id: string) {
    return await this.prisma.vote.count({
      where: { movie: { imdb_id } }
    });
  }

  async get_votes_user(user_id: number) {
    return await this.prisma.vote.findMany({
      where: { user: { id: user_id } },
      select: { imdb_id: true }
    });
  }

  async get_votes_movie(imdb_id: string) {
    return await this.prisma.vote.findMany({
      where: { movie: { imdb_id } },
      select: { user: true }
    })
  }

  async get_most_voted(count: number) {
    return await this.prisma.vote.groupBy({
      by: ['imdb_id'],
      _count: {
        user_id: true,
      },
      orderBy: {
        _count: {
          user_id: 'desc'
        }
      },
      take: count,
    })
  }

  async add(data: Prisma.VoteCreateInput) {
    return await this.prisma.vote.create({ data });
  }

  async delete(data : Prisma.VoteWhereUniqueInput) {
    return await this.prisma.vote.delete({ where: data });
  }

  async delete_all(imdb_id: string) {
    return await this.prisma.vote.deleteMany({ where: { imdb_id } });
  }

  async delete_all_user(user_id: number) {
    return await this.prisma.vote.deleteMany({ where: { user_id } });
  }
}
