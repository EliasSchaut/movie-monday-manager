import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PrismaService } from "../prisma.service";
import { MovieDBModule } from "../common/db_services/movies/movieDB.module";
import { UsersModule } from "../common/db_services/users/users.module";

@Module({
  imports: [MovieDBModule, UsersModule],
  controllers: [MovieController],
  providers: [PrismaService, MovieService]
})
export class MovieModule {}
