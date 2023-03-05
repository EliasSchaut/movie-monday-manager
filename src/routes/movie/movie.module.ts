import { Module } from '@nestjs/common';
import { MovieController } from '@/routes/movie/movie.controller';
import { MovieService } from '@/routes/movie/movie.service';
import { PrismaService } from "@/common/db_services/prisma.service";
import { MovieDBModule } from "@/common/db_services/movies/movieDB.module";
import { UserDBModule } from "@/common/db_services/users/userDB.module";
import { VoteDBModule } from "@/common/db_services/votes/voteDB.module";
import { VoteService } from "@/routes/vote/vote.service";
import { HistoryDBModule } from "@/common/db_services/histroy/historyDB.module";
import { WatchListDBModule } from "@/common/db_services/watchlist/watchListDB.module";
import { MovieInfoDBModule } from "@/common/db_services/movie_infos/movieInfoDB.module";
import { ImdbApiService } from "@/common/util_services/imdb_api.service";

@Module({
  imports: [MovieDBModule, UserDBModule, VoteDBModule, HistoryDBModule, WatchListDBModule, MovieInfoDBModule],
  controllers: [MovieController],
  providers: [PrismaService, MovieService, VoteService, ImdbApiService]
})
export class MovieModule {}
