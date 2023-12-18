import { Resolver } from '@nestjs/graphql';
import { MovieModel } from '@/types/models/movie.model';
import { MovieService } from '@/graphql/movie/movie.service';

@Resolver(() => MovieModel)
export class MovieResolver {
  constructor(private readonly movie_service: MovieService) {}
}
