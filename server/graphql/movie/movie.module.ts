import { Module } from '@nestjs/common';
import { MovieService } from '@/graphql/movie/movie.service';
import { MovieResolver } from '@/graphql/movie/movie.resolver';
import { MovieApiServiceProvider } from '@/common/services/movie_api/movie_api.provider';
import { ApiService } from '@/common/services/api.service';

@Module({
  providers: [MovieResolver, MovieService, MovieApiServiceProvider, ApiService],
  exports: [MovieService, MovieApiServiceProvider, ApiService],
})
export class MovieModule {}
