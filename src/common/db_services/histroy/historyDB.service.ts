import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class HistoryDBService {

  constructor(private readonly prisma: PrismaService) {}

  async get_all() {
    return await this.prisma.history.findMany();
  }

  async add(data: Prisma.HistoryCreateInput) {
    return await this.prisma.history.create({ data });
  }

  async has(imdb_id: string) {
    return (await this.prisma.history.count({ where: { imdb_id } })) > 0;
  }
}
