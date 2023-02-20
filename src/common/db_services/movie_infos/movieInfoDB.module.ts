import { Module } from '@nestjs/common';
import { MovieInfoDBService } from "@/common/db_services/movie_infos/movieInfoDB.service";
import { PrismaService } from "@/common/db_services/prisma.service";

@Module({
  providers: [MovieInfoDBService, PrismaService],
  exports: [MovieInfoDBService]
})
export class MovieInfoDBModule {}
