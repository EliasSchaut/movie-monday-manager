import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { CtxType } from '@/types/ctx.type';
import { ServerOauthModel } from '@/types/models/server_oauth.model';
import { ServerModel } from '@/types/models/server.model';
import { WarningException } from '@/common/exceptions/warning.exception';
import { ServerSettingsModel } from '@/types/models/server_settings.model';
import { ServerSettingsInputModel } from '@/types/models/inputs/server_settings.input';
import { PrismaException } from '@/common/exceptions/prisma.exception';

@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}

  async find_by_id(ctx: CtxType): Promise<ServerModel> {
    const server = await this.prisma.server.findUnique({
      where: {
        id: ctx.server_id,
      },
    });

    if (!server) {
      throw new WarningException(ctx.i18n.t('server.exception.not_found'));
    }

    return new ServerModel(server);
  }

  async update(
    server_input: ServerSettingsInputModel,
    ctx: CtxType,
  ): Promise<ServerSettingsModel> {
    const server_settings = await this.prisma.serverSettings
      .update({
        data: {
          ...server_input,
        },
        where: {
          server_id: ctx.server_id,
        },
      })
      .catch((e: Error) => {
        throw new PrismaException(e, {
          record_does_not_exist: ctx.i18n.t('server.exception.not_found'),
        });
      });

    return new ServerSettingsModel(server_settings);
  }

  async resolve_settings(ctx: CtxType): Promise<ServerSettingsModel> {
    const server_settings = await this.prisma.serverSettings.findUnique({
      where: {
        server_id: ctx.server_id,
      },
    });

    if (!server_settings) {
      throw new WarningException(ctx.i18n.t('server.exception.not_found'));
    }

    return new ServerSettingsModel(server_settings);
  }

  async resolve_oauth(
    secret_api_key: string | null,
    { server_id }: CtxType,
  ): Promise<ServerOauthModel[]> {
    const secret_api_key_check =
      (process.env.SECRET_API_KEY as string) === secret_api_key;
    return (
      await this.prisma.serverOAuth.findMany({
        where: {
          server_id: server_id,
        },
      })
    ).map((oauth) => {
      if (!secret_api_key_check) {
        oauth.secret = '';
      }
      return oauth;
    });
  }

  async find_oauth_by_name(
    name: string,
    secret_api_key: string | null,
    { server_id }: CtxType,
  ): Promise<ServerOauthModel | null> {
    const secret_api_key_check =
      (process.env.SECRET_API_KEY as string) === secret_api_key;
    const oauth = await this.prisma.serverOAuth.findFirst({
      where: {
        server_id: server_id,
        name: name,
      },
    });
    if (!secret_api_key_check && oauth) {
      oauth.secret = '';
    }
    return oauth;
  }
}
