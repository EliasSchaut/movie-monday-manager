import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '@/graphql/user/user.service';
import { ServerID } from '@/common/decorators/server.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { UserModel } from '@/types/models/user.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/graphql/auth/auth.guard';
import { UserID } from '@/common/decorators/user.decorator';
import { UserUpdateInputModel } from '@/types/models/inputs/user_update.input';
import { Ctx } from '@/common/decorators/ctx.decorator';
import { CtxType } from '@/types/ctx.type';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => UserModel, {
    name: 'user',
  })
  async user(@Ctx() ctx: CtxType): Promise<UserModel | null> {
    return this.userService.find_by_id(ctx);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserModel, { name: 'user_update' })
  async user_update(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @UserID() user_id: number,
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

  @UseGuards(AuthGuard)
  @Mutation(() => UserModel, { name: 'user_delete' })
  async user_delete(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @UserID() user_id: number,
  ): Promise<UserModel | null> {
    return this.userService.delete({ server_id, i18n, user_id });
  }
}
