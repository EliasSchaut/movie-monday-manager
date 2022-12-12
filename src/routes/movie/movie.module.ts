import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PrismaService } from "../../common/db_services/prisma.service";
import { MovieDBModule } from "../../common/db_services/movies/movieDB.module";
import { UserDBModule } from "../../common/db_services/users/userDB.module";
import { VoteDBModule } from "../../common/db_services/votes/voteDB.module";
import { VoteService } from "../vote/vote.service";
import { HistoryDBModule } from "../../common/db_services/histroy/historyDB.module";
import { WatchListDBModule } from "../../common/db_services/watchlist/watchListDB.module";

@Module({
  imports: [MovieDBModule, UserDBModule, VoteDBModule, HistoryDBModule, WatchListDBModule],
  controllers: [MovieController],
  providers: [PrismaService, MovieService, VoteService]
})
export class MovieModule {}
