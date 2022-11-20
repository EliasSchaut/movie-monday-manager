import { Module } from "@nestjs/common";
import { HistoryJob } from "./jobs/history.job";
import { WatchListJob } from "./jobs/watchlist.job";
import { MovieDBModule } from "../db_services/movies/movieDB.module";
import { WatchListDBModule } from "../db_services/watchlist/watchListDB.module";
import { VoteDBModule } from "../db_services/votes/voteDB.module";
import { HistoryDBModule } from "../db_services/histroy/historyDB.module";

@Module({
  imports: [MovieDBModule, WatchListDBModule, VoteDBModule, HistoryDBModule],
  providers: [HistoryJob, WatchListJob]
})
export class EventModule {}
