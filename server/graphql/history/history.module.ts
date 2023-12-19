import { Module } from '@nestjs/common';
import { HistoryResolver } from '@/graphql/history/history.resolver';
import { HistoryService } from '@/graphql/history/history.service';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  providers: [HistoryResolver, HistoryService, PrismaService],
})
export class HistoryModule {}
