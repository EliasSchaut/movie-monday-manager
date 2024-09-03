import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CtxType } from '@/types/common/ctx.type';
import { UserModel } from '@/types/models/user.model';
import { UserUpdateInputModel } from '@/types/models/inputs/user_update.input';
import { PasswordService } from '@/common/services/password.service';
import { WarningException } from '@/common/exceptions/warning.exception';
import { EmailService } from '@/common/services/email.service';
import { UserPwResetInputModel } from '@/types/models/inputs/user_pw_reset.input';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
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
      user_update_input_data.password = await PasswordService.hash(
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
        request_target_email: email,
        challenge: PasswordService.generate_challenge(),
      },
    });
  }

  async reset_password(
    user_pw_reset_input_data: UserPwResetInputModel,
    ctx: CtxType,
  ): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        challenge: user_pw_reset_input_data.challenge,
        id: user_pw_reset_input_data.user_id,
      },
    });
    if (!user || !user.request_pw_reset) {
      throw new WarningException(
        ctx.i18n.t('auth.exception.not_found_password_reset'),
      );
    }

    return new UserModel(
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: await PasswordService.hash(
            user_pw_reset_input_data.password,
          ),
          request_pw_reset: false,
        },
      }),
    );
  }

  async request_password_reset(
    username: string,
    ctx: CtxType,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      throw new WarningException(ctx.i18n.t('user.exception.not_found'));
    }

    const challenge = PasswordService.generate_challenge();
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        challenge: challenge,
        request_pw_reset: true,
      },
    });

    const pw_reset_url = this.emailService.generate_pw_reset_url(
      challenge,
      ctx.server!.origin!,
    );
    await this.emailService.send_password_reset(
      user.email,
      user.first_name + ' ' + user.last_name,
      pw_reset_url,
      ctx.server!.settings!.title!,
    );
    return true;
  }
}
