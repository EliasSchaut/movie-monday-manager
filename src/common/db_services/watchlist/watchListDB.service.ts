import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class WatchListDBService {

  constructor(private readonly prisma: PrismaService) {}

  async get_all() {
    return await this.prisma.watchList.findMany()
  }

  async add(data: Prisma.WatchListCreateInput) {
    return await this.prisma.watchList.create({ data })
  }

  async delete(imdb_id: string) {
    return await this.prisma.watchList.delete({
      where: {
        imdb_id
      }
    })
  }
}
