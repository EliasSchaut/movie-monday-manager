import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { WatchlistService } from '@/graphql/watchlist/watchlist.service';
import { WatchlistModel } from '@/types/models/watchlist.model';
import { ServerID } from '@/common/decorators/server_id.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/enums/role.enum';
import { WatchlistItemModel } from '@/types/models/watchlist_item.model';
import { UserID } from '@/common/decorators/user_id.decorator';
import { WatchlistInputModel } from '@/types/models/inputs/watchlist.input';
import { UserModel } from '@/types/models/user.model';
import { MovieIdInputModel } from '@/types/models/inputs/movie_id.input';

@Resolver(() => WatchlistItemModel)
export class WatchlistResolver {
  constructor(private readonly watchlist_service: WatchlistService) {}

  @Query(() => WatchlistModel, {
    name: 'watchlist',
  })
  async find(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<WatchlistModel> {
    return this.watchlist_service.find({ server_id, i18n });
  }

  @Role(RoleEnum.ADMIN)
  @Query(() => WatchlistModel, {
    name: 'watchlist_auto_info',
  })
  async auto_info(
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    //return this.watchlist_service.auto_info({ user_id, server_id, i18n });
  }

  @Role(RoleEnum.ADMIN)
  @Mutation(() => WatchlistItemModel, {
    name: 'watchlist_add_or_update',
  })
  async add_or_update(
    @Args('watchlist_input') watchlist_input: WatchlistInputModel,
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<WatchlistItemModel> {
    return this.watchlist_service.add_or_update(watchlist_input, {
      user_id,
      server_id,
      i18n,
    });
  }

  @Role(RoleEnum.ADMIN)
  @Mutation(() => WatchlistItemModel, {
    name: 'watchlist_delete',
  })
  async delete(
    @Args('movie_id_input') movie_id_input: MovieIdInputModel,
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<WatchlistItemModel> {
    return this.watchlist_service.delete(movie_id_input.movie_id, {
      user_id,
      server_id,
      i18n,
    });
  }

  @ResolveField(() => [UserModel], {
    name: 'interested_users',
  })
  async resolve_interested_users(
    @Parent() watchlist_item: WatchlistItemModel,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<UserModel[]> {
    return this.watchlist_service.resolve_interested_users(
      watchlist_item.movie.id,
      { server_id, i18n },
    );
  }
}
