import { Module } from '@nestjs/common';
import { HistoryResolver } from '@/graphql/history/history.resolver';
import { HistoryService } from '@/graphql/history/history.service';
import { MovieService } from '@/graphql/movie/movie.service';

@Module({
  providers: [HistoryResolver, HistoryService, MovieService],
})
export class HistoryModule {}
