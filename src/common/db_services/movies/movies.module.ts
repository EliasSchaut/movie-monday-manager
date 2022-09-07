import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PrismaService } from "../../../prisma.service";

@Module({
  providers: [MoviesService, PrismaService],
  exports: [MoviesService]
})
export class MoviesModule {}
