import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PrismaService } from "../prisma.service";
import { MovieDBModule } from "../common/db_services/movies/movieDB.module";

@Module({
  imports: [MovieDBModule],
  controllers: [MovieController],
  providers: [PrismaService, MovieService]
})
export class MovieModule {}
