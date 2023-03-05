import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { MovieInfo, Prisma } from "@prisma/client";

import { MovieDBService } from "@/common/db_services/movies/movieDB.service";
import { HistoryDBService } from "@/common/db_services/histroy/historyDB.service";
import { WatchListDBService } from "@/common/db_services/watchlist/watchListDB.service";
import { VoteDBService } from "@/common/db_services/votes/voteDB.service";
import { MovieInfoDBService } from "@/common/db_services/movie_infos/movieInfoDB.service";

@Injectable()
export class HistoryJob {

  constructor(private readonly movieDBService: MovieDBService,
              private readonly historyDBService: HistoryDBService,
              private readonly watchListDBService: WatchListDBService,
              private readonly movieInfoDBService: MovieInfoDBService,
              private readonly voteDBService: VoteDBService) {}

  @Cron(process.env.SCHEDULE_HISTORY as string)
  async run() {
    console.log('History job started');
    const watch_list = await this.watchListDBService.get_all()
    for (const movie of watch_list) {
      const movie_info_data = await this.movieInfoDBService.get_all_lang(movie.imdb_id) as MovieInfo[]
      const data = movie_info_data.map((item) => {
        return {
          imdb_id: item.imdb_id,
          title: item.title,
          link: item.link,
          language: item.language,
        } as Prisma.HistoryCreateInput
      })
      await this.historyDBService.add(data)
      await this.voteDBService.delete_all(movie.imdb_id)
      await this.watchListDBService.delete(movie.imdb_id)
      await this.movieDBService.delete(movie.imdb_id)
    }
  }

}
