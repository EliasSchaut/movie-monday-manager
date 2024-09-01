import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CtxType } from '@/types/common/ctx.type';
import { UserModel } from '@/types/models/user.model';
import { UserUpdateInputModel } from '@/types/models/inputs/user_update.input';
import { PasswordService } from '@/common/services/password.service';
import { WarningException } from '@/common/exceptions/warning.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async find_by_id(ctx: CtxType): Promise<UserModel> {
    const user = await this.prisma.user.findUnique({
      where: { id: ctx.user_id },
    });
    if (user === null) {
      throw new WarningException(ctx.i18n.t('user.exception.not_found'));
    }
    return new UserModel(user);
  }

  async update(
    user_update_input_data: UserUpdateInputModel,
    ctx: CtxType,
  ): Promise<UserModel | null> {
    await this.update__hash_password_if_present(user_update_input_data);
    await this.update__email_if_present(user_update_input_data, ctx);

    return new UserModel(
      await this.prisma.user.update({
        where: { id: ctx.user_id },
        data: user_update_input_data,
      }),
    );
  }

  async delete(ctx: CtxType): Promise<UserModel | null> {
    return new UserModel(
      await this.prisma.user.delete({
        where: { id: ctx.user_id },
      }),
    );
  }

  private async update__hash_password_if_present(
    user_update_input_data: UserUpdateInputModel,
  ): Promise<void> {
    if (user_update_input_data.password) {
      user_update_input_data.password = await this.passwordService.hash(
        user_update_input_data.password,
      );
    }
  }

  private async update__email_if_present(
    user_update_input_data: UserUpdateInputModel,
    ctx: CtxType,
  ): Promise<void> {
    if (user_update_input_data.email) {
      await this.email_update_request(user_update_input_data.email, ctx);
      user_update_input_data.email = undefined;
    }
  }

  private async email_update_request(
    email: string,
    ctx: CtxType,
  ): Promise<void> {
    this.prisma.user.update({
      where: {
        id: ctx.user_id,
      },
      data: {
        email_update_request: email,
        challenge: this.passwordService.generate_challenge(),
      },
    });
  }
}
