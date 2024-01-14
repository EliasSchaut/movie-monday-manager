import { Module } from '@nestjs/common';
import { HistoryResolver } from '@/graphql/history/history.resolver';
import { HistoryService } from '@/graphql/history/history.service';

@Module({
  providers: [HistoryResolver, HistoryService],
})
export class HistoryModule {}
