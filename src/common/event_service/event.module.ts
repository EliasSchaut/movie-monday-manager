import { Module } from "@nestjs/common";
import { HistoryJob } from "./jobs/history.job";
import { WatchListJob } from "./jobs/watchlist.job";
import { MovieDBModule } from "../db_services/movies/movieDB.module";
import { WatchListDBModule } from "../db_services/watchlist/watchListDB.module";
import { VoteDBModule } from "../db_services/votes/voteDB.module";
import { HistoryDBModule } from "../db_services/histroy/historyDB.module";
import { DiscordService } from "../util_services/discord.service";
import { AnnounceJob } from "./jobs/announce.job";
import { EmailService } from "../util_services/email.service";
import { UserDBModule } from "../db_services/users/userDB.module";

@Module({
  imports: [MovieDBModule, WatchListDBModule, VoteDBModule, HistoryDBModule, UserDBModule],
  providers: [HistoryJob, WatchListJob, AnnounceJob, DiscordService, EmailService]
})
export class EventModule {}
