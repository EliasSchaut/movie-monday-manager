import { Args, Query, Resolver } from '@nestjs/graphql';
import { VoteService } from '@/graphql/vote/vote.service';
import { VoteInputModel } from '@/types/models/inputs/vote.input';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/enums/role.enum';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { ServerID } from '@/common/decorators/server_id.decorator';
import { UserID } from '@/common/decorators/user_id.decorator';
import { VoteModel } from '@/types/models/vote.model';
import { ImdbIdInputModel } from '@/types/models/inputs/imdb_id.input';

@Resolver(() => VoteModel)
export class VoteResolver {
  constructor(private readonly vote_service: VoteService) {}

  @Role(RoleEnum.USER)
  @Query(() => VoteModel, {
    name: 'vote',
  })
  async find(
    @Args('imdb_id_input') imdb_id_input: ImdbIdInputModel,
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<VoteModel> {
    return this.vote_service.find(imdb_id_input.imdb_id, {
      user_id,
      server_id,
      i18n,
    });
  }

  @Role(RoleEnum.USER)
  @Query(() => [VoteModel], {
    name: 'vote_user',
  })
  async find_many_user(
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<VoteModel[]> {
    return this.vote_service.find_many_user({
      user_id,
      server_id,
      i18n,
    });
  }

  @Role(RoleEnum.USER)
  @Query(() => VoteModel, {
    name: 'vote_create',
  })
  async create_or_update(
    @Args('vote_input') vote_input: VoteInputModel,
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<VoteModel> {
    return this.vote_service.create_or_update(vote_input, {
      user_id,
      server_id,
      i18n,
    });
  }

  @Role(RoleEnum.USER)
  @Query(() => VoteModel, {
    name: 'vote_delete',
  })
  async delete(
    @Args('imdb_id_input') imdb_id_input_model: ImdbIdInputModel,
    @UserID() user_id: string,
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<VoteModel> {
    return this.vote_service.delete(imdb_id_input_model.imdb_id, {
      user_id,
      server_id,
      i18n,
    });
  }
}
