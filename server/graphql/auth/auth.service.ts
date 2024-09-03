import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { SignedInModel } from '@/types/models/signed_in.model';
import { CtxType } from '@/types/common/ctx.type';
import { PasswordService } from '@/common/services/password.service';
import { UserModel } from '@/types/models/user.model';
import { EmailService } from '@/common/services/email.service';
import { UserInputModel } from '@/types/models/inputs/user.input';
import { WarningException } from '@/common/exceptions/warning.exception';
import { PrismaException } from '@/common/exceptions/prisma.exception';
import { SignInInput } from '@/types/models/inputs/sign_in.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async sign_in(
    sign_in_input: SignInInput,
    ctx: CtxType,
  ): Promise<SignedInModel> {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        username: true,
        password: true,
        verified: true,
        is_admin: true,
      },
      where: { email: sign_in_input.email },
    });

    if (user === null)
      throw new WarningException(ctx.i18n.t('auth.exception.forbidden_login'));

    if (!(await PasswordService.compare(sign_in_input.password, user.password)))
      throw new WarningException(ctx.i18n.t('auth.exception.forbidden_login'));

    if (!user.verified)
      throw new WarningException(
        ctx.i18n.t('auth.exception.forbidden_not_verified'),
      );

    const payload = {
      username: user.username,
      sub: { id: user.id, is_admin: user.is_admin },
    };
    return new SignedInModel(
      await this.jwtService.signAsync(payload),
      user.is_admin,
    );
  }

  async register(
    user_input_data: UserInputModel,
    ctx: CtxType,
  ): Promise<UserModel | null> {
    user_input_data.password = await PasswordService.hash(
      user_input_data.password,
    );
    return this.prisma.user
      .create({
        data: {
          ...user_input_data,
          server_id: ctx.server_id,
          challenge: PasswordService.generate_challenge(),
        },
      })
      .then((user) => {
        this.emailService.send_verify(
          user.email,
          user.username,
          this.emailService.generate_verify_url(
            user.challenge as string,
            ctx.server!.origin!,
          ),
          ctx.server!.settings!.title!,
        );
        return new UserModel(user).clear_system_info();
      })
      .catch((e: Error) => {
        throw new PrismaException(e, {
          unique_constraint_violation: ctx.i18n.t(
            'user.exception.conflict_username',
          ),
          no_matches: ctx.i18n.t('user.exception.create'),
        });
      });
  }

  async verify(challenge: string, ctx: CtxType): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: { challenge: challenge, id: ctx.user_id },
    });
    if (!user || user.verified) {
      throw new WarningException(ctx.i18n.t('auth.exception.not_found_verify'));
    }

    return new UserModel(
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          verified: true,
        },
      }),
    );
  }
}
