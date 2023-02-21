import { Module } from "@nestjs/common";

import { HistoryJob } from "@/common/event_service/jobs/history.job";
import { WatchListJob } from "@/common/event_service/jobs/watchlist.job";
import { MovieDBModule } from "@/common/db_services/movies/movieDB.module";
import { WatchListDBModule } from "@/common/db_services/watchlist/watchListDB.module";
import { VoteDBModule } from "@/common/db_services/votes/voteDB.module";
import { HistoryDBModule } from "@/common/db_services/histroy/historyDB.module";
import { DiscordService } from "@/common/util_services/discord.service";
import { AnnounceJob } from "@/common/event_service/jobs/announce.job";
import { EmailService } from "@/common/util_services/email.service";
import { UserDBModule } from "@/common/db_services/users/userDB.module";
import { MovieInfoDBModule } from "@/common/db_services/movie_infos/movieInfoDB.module";

@Module({
  imports: [MovieDBModule, WatchListDBModule, VoteDBModule, HistoryDBModule, UserDBModule, MovieInfoDBModule],
  providers: [HistoryJob, WatchListJob, AnnounceJob, DiscordService, EmailService]
})
export class EventModule {}
