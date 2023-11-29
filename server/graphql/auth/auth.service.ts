import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/db/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModel } from '@/types/models/auth.model';
import { CtxType } from '@/types/ctx.type';
import { GraphQLError } from 'graphql/error';
import { PasswordService } from '@/common/util/password.service';
import { UserPwResetInputModel } from '@/types/models/inputs/user_pw_reset.input';
import { UserModel } from '@/types/models/user.model';
import { EmailService } from '@/common/util/email.service';
import { UserInputModel } from '@/types/models/inputs/user.input';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
  ) {}

  async sign_in(
    email: string,
    password: string,
    ctx: CtxType,
  ): Promise<AuthModel> {
    const user = await this.prisma.user.findUnique({
      select: { id: true, password: true, verified: true, is_admin: true },
      where: { email: email },
    });

    if (user === null) {
      return {
        code: 'warn',
        response: ctx.i18n.t('auth.exception.forbidden_login'),
      } as AuthModel;
    }
    if (!(await this.passwordService.compare(password, user.password))) {
      return {
        code: 'warn',
        response: ctx.i18n.t('auth.exception.forbidden_login'),
      } as AuthModel;
    }
    if (!user.verified) {
      return {
        code: 'warn',
        response: ctx.i18n.t('auth.exception.forbidden_not_verified'),
      } as AuthModel;
    }

    const payload = { username: user.id, sub: null };
    return {
      barrier_token: await this.jwtService.signAsync(payload),
      is_admin: user.is_admin,
      success: true,
      code: 'success',
    } as AuthModel;
  }

  async register(
    user_input_data: UserInputModel,
    ctx: CtxType,
  ): Promise<UserModel | null> {
    user_input_data.password = await this.passwordService.hash(
      user_input_data.password,
    );
    return this.prisma.user
      .create({
        data: {
          ...user_input_data,
          server_id: ctx.server_id,
        },
      })
      .then((user) => {
        this.emailService.send_verify(
          user.email,
          user.username,
          this.emailService.generate_verify_url(user.challenge as string),
        );
        user.challenge = '';
        return {
          ...user,
          success: true,
          code: 'success',
          response: ctx.i18n.t('auth.success.register'),
        } as UserModel;
      })
      .catch((e: PrismaClientKnownRequestError) => {
        if (e.code === 'P2002') {
          return {
            code: 'warn',
            response: ctx.i18n.t('user.exception.conflict_username'),
          } as UserModel;
        } else {
          return {
            code: 'danger',
            response: ctx.i18n.t('user.exception.create'),
          } as UserModel;
        }
      });
  }

  async verify(challenge: string, ctx: CtxType): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: { challenge: challenge },
    });
    if (!user || user.verified) {
      throw new GraphQLError(ctx.i18n.t('auth.exception.not_found_verify'), {
        extensions: { code: 'WARNING' },
      });
    }

    return (await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
      },
    })) as UserModel;
  }

  async reset_password(
    user_pw_reset_input_data: UserPwResetInputModel,
    ctx: CtxType,
  ): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: { challenge: user_pw_reset_input_data.challenge },
    });
    if (!user || !user.pw_reset) {
      throw new GraphQLError(
        ctx.i18n.t('auth.exception.not_found_password_reset'),
        {
          extensions: { code: 'WARNING' },
        },
      );
    }

    return (await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await this.passwordService.hash(
          user_pw_reset_input_data.password,
        ),
        pw_reset: false,
      },
    })) as UserModel;
  }

  async reset_password_request(
    username: string,
    ctx: CtxType,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return false;
    }

    const challenge = await this.passwordService.generate_challenge();
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        challenge: challenge,
        pw_reset: true,
      },
    });

    const pw_reset_url = this.emailService.generate_pw_reset_url(challenge);
    await this.emailService.send_password_reset(
      user.email,
      user.first_name + ' ' + user.last_name,
      pw_reset_url,
    );
    return true;
  }
}
