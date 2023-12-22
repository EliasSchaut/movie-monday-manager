import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '@/common/services/prisma.service';
import { DangerException } from '@/common/exceptions/danger.exception';
import { I18nContext } from 'nestjs-i18n';

export const ServerID = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const gql_ctx = GqlExecutionContext.create(ctx);
    const req = gql_ctx.getContext().req;
    const prisma = new PrismaService();
    const server = await prisma.server.findUnique({
      select: {
        id: true,
      },
      where: {
        origin: req.headers.origin,
      },
    });

    if (!server) {
      throw new DangerException(
        I18nContext.current()!.t('server.exception.not_found'),
      );
    }

    return server.id;
  },
);
