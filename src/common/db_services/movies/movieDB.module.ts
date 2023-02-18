import { Module } from '@nestjs/common';
import { MovieDBService } from './movieDB.service';
import { PrismaService } from "../prisma.service";
import { MovieInfoDBModule } from "../movie_infos/movieInfoDB.module";

@Module({
  imports: [MovieInfoDBModule],
  providers: [MovieDBService, PrismaService],
  exports: [MovieDBService]
})
export class MovieDBModule {}
