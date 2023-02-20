import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/common/db_services/prisma.service";
import { MovieInfoDBService } from "@/common/db_services/movie_infos/movieInfoDB.service";

@Injectable()
export class MovieDBService {

  constructor(private readonly prisma: PrismaService,
              private readonly movieInfo: MovieInfoDBService) {
  }

  async get(imdb_id: string) {
    return this.prisma.movie.findUnique({
      where: { imdb_id }
    });
  }

  async get_all() {
    return this.prisma.movie.findMany();
  }

  async get_all_imdb(): Promise<string[]> {
    return (await this.prisma.movie.findMany({ select: { imdb_id: true } })).map((movie) => movie.imdb_id);
  }

  async has(imdb_id: string) {
    return (await this.prisma.movie.count({ where: { imdb_id } })) > 0;
  }

  async get_all_proposed(user_id: number) {
    return this.prisma.movie.findMany({
      where: { proposer_id: user_id }
    });
  }

  async add(data: Prisma.MovieCreateInput) {
    return this.prisma.movie.create({ data });
  }

  async delete(imdb_id: string) {
    await this.movieInfo.delete(imdb_id);
    return this.prisma.movie.delete({ where: { imdb_id } });
  }

  async delete_all_proposed(user_id: number) {
    const movies = await this.get_all_proposed(user_id);
    for (const movie of movies) {
      await this.movieInfo.delete(movie.imdb_id);
      await this.delete(movie.imdb_id);
    }
  }
}
