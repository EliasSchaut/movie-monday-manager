import { Module } from '@nestjs/common';
import { MovieService } from '@/graphql/movie/movie.service';
import { MovieResolver } from '@/graphql/movie/movie.resolver';
import { ImdbApiService } from '@/common/services/imdb_api.service';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  providers: [MovieResolver, MovieService, ImdbApiService, PrismaService],
})
export class MovieModule {}
