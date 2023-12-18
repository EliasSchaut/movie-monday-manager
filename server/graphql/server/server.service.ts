import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { CtxType } from '@/types/ctx.type';
import { ServerOauthModel } from '@/types/models/server_oauth.model';
import { ServerModel } from '@/types/models/server.model';

@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}

  async find_by_id({ server_id }: CtxType): Promise<ServerModel> {
    return {
      ...(await this.prisma.server.findUnique({
        where: {
          id: server_id,
        },
        select: {
          id: true,
          title: true,
          name: true,
          desc: true,
        },
      })),
      success: true,
    } as ServerModel;
  }

  async find_all_oauth(
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
