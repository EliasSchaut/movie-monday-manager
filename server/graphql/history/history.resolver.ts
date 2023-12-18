import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MovieHistoryModel } from '@/types/models/movie_history.model';
import { HistoryService } from '@/graphql/history/history.service';
import { ServerID } from '@/common/decorators/server.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { MovieHistoryInputModel } from '@/types/models/inputs/movie_history.input';
import { ImdbIdInputModel } from '@/types/models/inputs/imdb_id.input';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/enums/role.enum';

@Resolver(() => MovieHistoryModel)
export class HistoryResolver {
  constructor(private readonly history_service: HistoryService) {}

  @Query(() => [MovieHistoryModel], {
    name: 'history_get_all',
  })
  async get_all(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieHistoryModel[]> {
    return this.history_service.get_all({ server_id, i18n });
  }

  @Role(RoleEnum.ADMIN)
  @Mutation(() => MovieHistoryModel, {
    name: 'history_add',
  })
  async add(
    @Args('history_input') history_input: MovieHistoryInputModel,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<MovieHistoryModel> {
    return this.history_service.add(history_input, { server_id, i18n });
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
