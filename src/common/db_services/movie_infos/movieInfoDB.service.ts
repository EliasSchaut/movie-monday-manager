import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/common/db_services/prisma.service";

@Injectable()
export class MovieInfoDBService {

  constructor(private readonly prisma: PrismaService) {
  }

  async get(imdb_id: string, language: string = "en") {
    return this.prisma.movieInfo.findUnique({
      where: { imdb_id_language: { imdb_id, language } }
    })
  }

  async get_all_lang(imdb_id: string) {
    return this.prisma.movieInfo.findMany({
      where: { imdb_id }
    })
  }

  async get_all(language: string = "en") {
    return this.prisma.movieInfo.findMany({
      where: { language: language }
    })
  }

  async has(imdb_id: string) {
    const count = await this.prisma.movieInfo.count({
      where: { imdb_id }
    })

    return count > 0;
  }

  async add(data: Prisma.MovieInfoCreateInput[]) {
    for (const datum of data) {
      await this.prisma.movieInfo.create({
        data: datum
      })
    }
  }

  async delete(imdb_id: string) {
    return this.prisma.movieInfo.deleteMany({
      where: { imdb_id }
    })
  }
}
