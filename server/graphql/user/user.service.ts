import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/db/prisma.service';
import { CtxType } from '@/types/ctx.type';
import { UserModel } from '@/types/models/user.model';
import { UserUpdateInputModel } from '@/types/models/inputs/user_update.input';
import { PasswordService } from '@/common/util/password.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async find_by_id(ctx: CtxType): Promise<UserModel | null> {
    return (await this.prisma.user.findUnique({
      where: { id: ctx.user_id },
    })) as UserModel;
  }

  async update(
    user_update_input_data: UserUpdateInputModel,
    ctx: CtxType,
  ): Promise<UserModel | null> {
    return (await this.prisma.user.update({
      where: { id: ctx.user_id },
      data: user_update_input_data,
    })) as UserModel;
  }

  async delete(ctx: CtxType): Promise<UserModel | null> {
    return (await this.prisma.user.delete({
      where: { id: ctx.user_id },
    })) as UserModel;
  }
}
