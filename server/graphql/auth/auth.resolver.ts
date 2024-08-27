import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '@/graphql/auth/auth.service';
import { AuthModel } from '@/types/models/auth.model';
import { ServerId } from '@/common/decorators/server_id.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { UserModel } from '@/types/models/user.model';
import { UserPwResetInputModel } from '@/types/models/inputs/user_pw_reset.input';
import { UserInputModel } from '@/types/models/inputs/user.input';
import { ServerModel } from '@/types/models/server.model';
import { Server } from '@/common/decorators/server.decorator';
import { PrismaService } from 'nestjs-prisma';

@Resolver(() => AuthModel)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => AuthModel, { name: 'auth_sign_in' })
  async sign_in(
    @Args('email') email: string,
    @Args('password') password: string,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<AuthModel> {
    return await this.authService.sign_in(email, password, {
      server_id,
      i18n,
    });
  }

  @Mutation(() => UserModel, { name: 'auth_register' })
  async register(
    @Args('user_input_data') user_input_data: UserInputModel,
    @Server() server: ServerModel,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<UserModel | null> {
    return await this.authService.register(user_input_data, {
      server_id: server.id,
      server,
      i18n,
    });
  }

  @Mutation(() => UserModel, { name: 'auth_verify' })
  async verify(
    @Args('challenge') challenge: string,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<UserModel | null> {
    return await this.authService.verify(challenge, { server_id, i18n });
  }

  @Mutation(() => UserModel, { name: 'auth_user_pw_reset' })
  async user_pw_reset(
    @Args('user_pw_reset_input_data')
    pw_reset_input_data: UserPwResetInputModel,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<UserModel | null> {
    return this.authService.reset_password(pw_reset_input_data, {
      server_id,
      i18n,
    });
  }

  @Mutation(() => Boolean, {
    name: 'auth_user_pw_reset_request',
    description:
      "Request a password reset for a user. A new challenge will sent to the user's email. Returns true if the request was successful.",
  })
  async user_pw_reset_request(
    @Server() server: ServerModel,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Args('username') username: string,
  ): Promise<boolean> {
    return this.authService.reset_password_request(username, {
      server_id: server.id,
      server: server,
      i18n,
    });
  }
}
