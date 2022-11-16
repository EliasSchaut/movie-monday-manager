import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class WatchListDBService {

  constructor(private readonly prisma: PrismaService) {}

  async get_all() {
    return await this.prisma.watchList.findMany()
  }

  async add(imdb_id: string) {
    return await this.prisma.watchList.create({
      data: {
        imdb_id
      }
    })
  }

  async delete(imdb_id: string) {
    return await this.prisma.watchList.delete({
      where: {
        imdb_id
      }
    })
  }
}
