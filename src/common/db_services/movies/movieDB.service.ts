import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class MovieDBService {

  constructor(private readonly prisma: PrismaService) {}

  async get(imdb_id : string) {
    return await this.prisma.movie.findUnique({
      where: { imdb_id },
    });
  }

  async get_imdb(imdb_id: string) {
    return await this.prisma.movie.findUnique({
      where: { imdb_id },
    });
  }

  async get_all() {
    return await this.prisma.movie.findMany();
  }

  async get_all_proposed(user_id : number) {
    return await this.prisma.movie.findMany({
      where: { proposer_id: user_id }
    });
  }

  async add(data: Prisma.MovieCreateInput) {
    return await this.prisma.movie.create({ data });
  }

  async delete(movie_id : Prisma.MovieWhereUniqueInput) {
    return await this.prisma.movie.delete({ where: movie_id });
  }

  async delete_all_proposed(user_id : number) {
    return await this.prisma.movie.deleteMany({
      where: { proposer_id: user_id } as Prisma.MovieWhereUniqueInput
    });
  }
}
