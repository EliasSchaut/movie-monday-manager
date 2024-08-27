import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ServerService } from '@/graphql/server/server.service';
import { ServerModel } from '@/types/models/server.model';
import { ServerId } from '@/common/decorators/server_id.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { ServerOauthModel } from '@/types/models/server_oauth.model';
import { ServerSettingsModel } from '@/types/models/server_settings.model';
import { Role } from '@/common/decorators/role.decorator';
import { RoleEnum } from '@/types/enums/role.enum';
import { ServerSettingsInputModel } from '@/types/models/inputs/server_settings.input';

@Resolver(() => ServerModel)
export class ServerResolver {
  constructor(private readonly serverService: ServerService) {}

  @Query(() => ServerModel, {
    name: 'server',
    description: 'Get server Information',
  })
  async find_by_id(
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<ServerModel> {
    return this.serverService.find_by_id({ server_id, i18n });
  }

  @Role(RoleEnum.ADMIN)
  @Mutation(() => ServerSettingsModel)
  async update(
    @Args('server_input') server_input: ServerSettingsInputModel,
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<ServerSettingsModel> {
    return this.serverService.update(server_input, { server_id, i18n });
  }

  @ResolveField(() => ServerSettingsModel, {
    name: 'settings',
  })
  async resolve_settings(
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<ServerSettingsModel> {
    return this.serverService.resolve_settings({ server_id, i18n });
  }

  @ResolveField(() => [ServerOauthModel], {
    name: 'oauth',
  })
  async resolve_oauth(
    @ServerId() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<ServerOauthModel[] | null> {
    return this.serverService.resolve_oauth({
      server_id,
      i18n,
    });
  }
}
