import { Module } from '@nestjs/common';
import { VoteController } from "./vote.controller";
import { VoteService } from "./vote.service";
import { VoteDBModule } from "../../common/db_services/votes/voteDB.module";
import { UserDBModule } from "../../common/db_services/users/userDB.module";
import { MovieDBModule } from "../../common/db_services/movies/movieDB.module";
import { PrismaService } from "../../common/db_services/prisma.service";

@Module({
  imports: [VoteDBModule, UserDBModule, MovieDBModule],
  controllers: [VoteController],
  providers: [PrismaService, VoteService]
})
export class VoteModule {}
