import { Provider } from '@nestjs/common';
import { TmdbApiService } from '@/common/services/movie_api/tmdb_api.service';
import { OmdbApiService } from '@/common/services/movie_api/omdb_api.service';
import { MovieApiService } from '@/common/services/movie_api/movie_api.service';
import { TomdbApiService } from '@/common/services/movie_api/tomdb_api.service';
import { DangerException } from '@/common/exceptions/danger.exception';
import { MovieApiTypeEnum } from '@/types/movie/movie_type.utils';

export const MovieApiServiceProvider: Provider = {
  provide: MovieApiService,
  useClass: (() => {
    switch (process.env.MOVIE_API_TYPE) {
      case MovieApiTypeEnum.TMDB:
        return TmdbApiService;
      case MovieApiTypeEnum.OMDB:
        return OmdbApiService;
      case MovieApiTypeEnum.TOMDB:
        return TomdbApiService;
      default:
        throw new DangerException('Unsupported MOVIE_API_TYPE');
    }
  })(),
};
