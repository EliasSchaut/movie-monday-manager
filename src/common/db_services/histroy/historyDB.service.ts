import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";
import { HistoryWithoutLangType } from "@/types/movie.types/history_without_lang.type";

@Injectable()
export class HistoryDBService {

  constructor(private readonly prisma: PrismaService) {}

  async get_all() {
    return this.prisma.history.findMany();
  }

  async get_all_without_lang(language: string): Promise<HistoryWithoutLangType[]> {
    return this.prisma.history.findMany({
      select: {
        imdb_id: true,
        watched_at: true,
        title: true,
        link: true,
      },
      where: {
        language: language
      }
    });
  }

  async add(data: Prisma.HistoryCreateInput[]) {
    data.forEach((item) => {
      this.prisma.history.create({ data: item });
    })
  }

  async has(imdb_id: string) {
    return (await this.prisma.history.count({ where: { imdb_id } })) > 0;
  }
}
