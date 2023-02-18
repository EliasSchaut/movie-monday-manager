import { Module } from '@nestjs/common';
import { MovieInfoDBService } from './movieInfoDB.service';
import { PrismaService } from "../prisma.service";

@Module({
  providers: [MovieInfoDBService, PrismaService],
  exports: [MovieInfoDBService]
})
export class MovieInfoDBModule {}
