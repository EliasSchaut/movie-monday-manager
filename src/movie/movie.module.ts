import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieDBService } from "../common/db_services/movies/movieDB.service";

@Module({
  controllers: [MovieController],
  providers: [MovieService, MovieDBService]
})
export class MovieModule {}
