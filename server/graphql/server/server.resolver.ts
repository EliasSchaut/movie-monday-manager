import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ServerService } from '@/graphql/server/server.service';
import { ServerModel } from '@/types/models/server.model';
import { ServerID } from '@/common/decorators/server.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { ServerOauthModel } from '@/types/models/server_oauth.model';

@Resolver(() => ServerModel)
export class ServerResolver {
  constructor(private readonly serverService: ServerService) {}

  @Query(() => ServerModel, {
    name: 'server',
    description: 'Get server Information',
  })
  async server(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    return this.serverService.find_by_id({ server_id, i18n });
  }

  @ResolveField(() => [ServerOauthModel], {})
  async oauth(
    @ServerID() server_id: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Args('secret_api_key', { nullable: true, defaultValue: null })
    secret_api_key: string,
    @Args('name', { nullable: true, defaultValue: null }) name: string,
  ): Promise<ServerOauthModel[] | null> {
    if (name) {
      const oauth = await this.serverService.find_oauth_by_name(
        name,
        secret_api_key,
        {
          server_id,
          i18n,
        },
      );
      if (oauth) {
        return [oauth];
      }
      return null;
    } else {
      return this.serverService.find_all_oauth(secret_api_key, {
        server_id,
        i18n,
      });
    }
  }
}
