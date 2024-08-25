import { Module } from '@nestjs/common';
import { MovieService } from '@/graphql/movie/movie.service';
import { MovieResolver } from '@/graphql/movie/movie.resolver';
import { MovieApiServiceProvider } from '@/common/services/movie_api/movie_api.provider';

@Module({
  providers: [MovieResolver, MovieService, MovieApiServiceProvider],
  exports: [MovieService, MovieApiServiceProvider],
})
export class MovieModule {}
