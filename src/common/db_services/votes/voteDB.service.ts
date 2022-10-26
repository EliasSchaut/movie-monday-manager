import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../../prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class VoteDBService {

  constructor(private readonly prisma: PrismaService) {}

  async get(vote_id : Prisma.VoteWhereUniqueInput) {
    return await this.prisma.vote.findUnique({
      where: vote_id,
    });
  }

  async get_all() {
    return await this.prisma.vote.findMany();
  }

  async add(data: Prisma.VoteCreateInput) {
    return await this.prisma.vote.create({ data });
  }

  async delete(vote_id : Prisma.VoteWhereUniqueInput) {
    return await this.prisma.movie.delete({ where: vote_id });
  }

}
