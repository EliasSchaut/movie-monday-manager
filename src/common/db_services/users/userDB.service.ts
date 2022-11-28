import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { PasswordService } from "../../util_services/password.service";

@Injectable()
export class UserDBService {
  constructor(private readonly prisma: PrismaService,
              private readonly passwordService: PasswordService) {}

  async get(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async has_user(username: string): Promise<boolean> {
    return (await this.prisma.user.count({ where: {username} })) > 0;
  }

  async get_all(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async get_all_opt_in() : Promise<User[]> {
    return this.prisma.user.findMany({ where: { email_opt_in: true } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await this.passwordService.hash(data.password);
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
