import { Module } from '@nestjs/common';
import { HistoryResolver } from '@/graphql/history/history.resolver';
import { HistoryService } from '@/graphql/history/history.service';
import { MovieModule } from '@/graphql/movie/movie.module';

@Module({
  imports: [MovieModule],
  providers: [HistoryResolver, HistoryService],
})
export class HistoryModule {}
