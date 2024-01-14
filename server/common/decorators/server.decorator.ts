import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { DangerException } from '@/common/exceptions/danger.exception';
import { I18nContext } from 'nestjs-i18n';
import { ServerModel } from '@/types/models/server.model';

const prisma = new PrismaService();

export const Server = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const gql_ctx = GqlExecutionContext.create(ctx);
    const req = gql_ctx.getContext().req;
    const server = await prisma.server.findUnique({
      include: {
        settings: true,
      },
      where: {
        origin: req.headers.origin,
      },
    });

    if (server === null || server.settings === null) {
      throw new DangerException(
        I18nContext.current()!.t('server.exception.not_found'),
      );
    }
    return new ServerModel(server);
  },
);
