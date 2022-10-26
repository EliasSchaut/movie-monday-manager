import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { User, Prisma } from '@prisma/client';
const bcrypt = require('bcrypt');

@Injectable()
export class UserDBService {
  constructor(private readonly prisma: PrismaService) {}

  async get(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async get_all(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }
}
