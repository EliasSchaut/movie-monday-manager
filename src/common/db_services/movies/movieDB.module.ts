import { Module } from '@nestjs/common';
import { MovieDBService } from './movieDB.service';
import { PrismaService } from "../../../prisma.service";

@Module({
  providers: [MovieDBService, PrismaService],
  exports: [MovieDBService]
})
export class MovieDBModule {}
