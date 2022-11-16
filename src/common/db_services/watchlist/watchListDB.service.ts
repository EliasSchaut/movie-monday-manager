import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class WatchListDBService {

  constructor(private readonly prisma: PrismaService) {}

  async get_all() {
    this.prisma.watchList.findMany()
  }

  async add(imdb_id: string) {
    this.prisma.watchList.create({
      data: {
        imdb_id
      }
    })
  }
}
