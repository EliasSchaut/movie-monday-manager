import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '@/common/services/prisma.service';
import { DangerException } from '@/common/exceptions/danger.exception';
import { I18nContext } from 'nestjs-i18n';
import { ServerSettingsModel } from '@/types/models/server_settings.model';

export const ServerSettings = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const gql_ctx = GqlExecutionContext.create(ctx);
    const req = gql_ctx.getContext().req;
    const prisma = new PrismaService();
    const server = await prisma.server.findUnique({
      include: {
        settings: true,
      },
      where: {
        origin: req.headers.origin,
      },
    });

    if (!server || !server.settings) {
      throw new DangerException(
        I18nContext.current()!.t('server.exception.not_found'),
      );
    }

    return new ServerSettingsModel(server.settings);
  },
);
