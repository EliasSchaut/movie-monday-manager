import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '@/graphql/auth/auth.service';
import { SignedInModel } from '@/types/models/signed_in.model';
import { ServerID } from '@/common/decorators/server_id.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { UserModel } from '@/types/models/user.model';
import { UserInputModel } from '@/types/models/inputs/user.input';
import { ServerModel } from '@/types/models/server.model';
import { Server } from '@/common/decorators/server.decorator';
import { ServerId } from '@/types/common/ids.type';
import { SignInInput } from '@/types/models/inputs/sign_in.input';

@Resolver(() => SignedInModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => SignedInModel, { name: 'auth_sign_in' })
  async sign_in(
    @Args('user_sign_in_input') user_sign_in_input: SignInInput,
    @ServerID() server_id: ServerId,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<SignedInModel> {
    return await this.authService.sign_in(user_sign_in_input, {
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
    @ServerID() server_id: ServerId,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<UserModel | null> {
    return await this.authService.verify(challenge, { server_id, i18n });
  }
}
