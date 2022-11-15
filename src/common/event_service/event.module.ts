import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { HistoryJob } from "./jobs/history.job";
import { WatchListJob } from "./jobs/watchlist.job";
import { MovieDBModule } from "../db_services/movies/movieDB.module";
import { WatchListDBModule } from "../db_services/watchlist/watchListDB.module";
import { VoteDBModule } from "../db_services/votes/voteDB.module";
import { HistoryDBModule } from "../db_services/histroy/historyDB.module";

@Module({
  imports: [MovieDBModule, WatchListDBModule, VoteDBModule, HistoryDBModule],
  providers: [EventService, HistoryJob, WatchListJob]
})
export class EventModule {
  constructor(private readonly eventService: EventService) {
    this.eventService.init()
  }
}
