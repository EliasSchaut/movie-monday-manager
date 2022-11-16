import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class HistoryDBService {

  constructor(private readonly prisma: PrismaService) {}

  async add(data: Prisma.HistoryCreateInput) {
    return await this.prisma.history.create({ data });
  }
}
