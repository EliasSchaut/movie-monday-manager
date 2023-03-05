import { Module } from '@nestjs/common';
import { MovieDBService } from "@/common/db_services/movies/movieDB.service";
import { PrismaService } from "@/common/db_services/prisma.service";
import { MovieInfoDBModule } from "@/common/db_services/movie_infos/movieInfoDB.module";

@Module({
  imports: [MovieInfoDBModule],
  providers: [MovieDBService, PrismaService],
  exports: [MovieDBService]
})
export class MovieDBModule {}
