import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MovieHistoryModel } from '@/types/models/movie_history.model';
import { HistoryService } from '@/graphql/history/history.service';
import { ServerID } from '@/common/decorators/server_id.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { MovieHistoryInputModel } from '@/types/models/inputs/movie_history.input';
import { ImdbIdInputModel } from '@/types/models/inputs/imdb_id.input';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/enums/role.enum';

@Resolver(() => MovieHistoryModel)
export class HistoryResolver {
  constructor(private readonly history_service: HistoryService) {}

  @Query(() => MovieHistoryModel, {
    name: 'history',
  })
  async find_by_id(
    @Args('imdb_id_input') imdb_id_input: ImdbIdInputModel,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieHistoryModel> {
    return this.history_service.find_by_id(imdb_id_input.imdb_id, {
      server_id,
      i18n,
    });
  }

  @Query(() => [MovieHistoryModel], {
    name: 'history_find_many',
  })
  async find_many(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieHistoryModel[]> {
    return this.history_service.find_many({ server_id, i18n });
  }

  @Role(RoleEnum.ADMIN)
  @Mutation(() => MovieHistoryModel, {
    name: 'history_add',
  })
  async create(
    @Args('history_input') history_input: MovieHistoryInputModel,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieHistoryModel> {
    return this.history_service.create(history_input, { server_id, i18n });
  }

  @Role(RoleEnum.ADMIN)
  @Mutation(() => MovieHistoryModel, {
    name: 'history_delete',
  })
  async delete(
    @Args('imdb_id_input') imdb_id_input: ImdbIdInputModel,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieHistoryModel> {
    return this.history_service.delete(imdb_id_input.imdb_id, {
      server_id,
      i18n,
    });
  }
}
