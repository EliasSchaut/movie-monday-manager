import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '@/graphql/user/user.service';
import { ServerID } from '@/common/decorators/server_id.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { UserModel } from '@/types/models/user.model';
import { UserID } from '@/common/decorators/user_id.decorator';
import { UserUpdateInputModel } from '@/types/models/inputs/user_update.input';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/auth/role.enum';
import { UserPwResetInputModel } from '@/types/models/inputs/user_pw_reset.input';
import { ServerId } from '@/types/common/ids.type';
import { Server } from '@/common/decorators/server.decorator';
import { ServerModel } from '@/types/models/server.model';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Role(RoleEnum.USER)
  @Query(() => UserModel, {
    name: 'user',
  })
  async user(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @UserID() user_id: string,
  ): Promise<UserModel | null> {
    return this.userService.find_by_id({ server_id, i18n, user_id });
  }

  @Role(RoleEnum.USER)
  @Mutation(() => UserModel, { name: 'user_update' })
  async user_update(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @UserID() user_id: string,
    @Args({
      name: 'user_update_input_data',
      type: () => UserUpdateInputModel,
    })
    user_update_input_data: UserUpdateInputModel,
  ): Promise<UserModel | null> {
    return this.userService.update(user_update_input_data, {
      server_id,
      i18n,
      user_id,
    });
  }

  @Role(RoleEnum.USER)
  @Mutation(() => UserModel, { name: 'user_delete' })
  async user_delete(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @UserID() user_id: string,
  ): Promise<UserModel | null> {
    return this.userService.delete({ server_id, i18n, user_id });
  }

  @Mutation(() => UserModel, { name: 'user_pw_reset' })
  async user_reset_password(
    @Args('user_pw_reset_input_data')
    pw_reset_input_data: UserPwResetInputModel,
    @ServerID() server_id: ServerId,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<UserModel | null> {
    return this.userService.reset_password(pw_reset_input_data, {
      server_id,
      i18n,
    });
  }

  @Mutation(() => Boolean, {
    name: 'user_request_pw_reset',
    description:
      "Request a password reset for a user. A new challenge will sent to the user's email. Returns true if the request was successful.",
  })
  async user_request_password_reset(
    @Server() server: ServerModel,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Args('username') username: string,
  ): Promise<boolean> {
    return this.userService.request_password_reset(username, {
      server_id: server.id,
      server: server,
      i18n,
    });
  }
}
