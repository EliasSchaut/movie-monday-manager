import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PrismaService } from "../common/db_services/prisma.service";
import { MovieDBModule } from "../common/db_services/movies/movieDB.module";
import { UserDBModule } from "../common/db_services/users/userDB.module";

@Module({
  imports: [MovieDBModule, UserDBModule],
  controllers: [MovieController],
  providers: [PrismaService, MovieService]
})
export class MovieModule {}
