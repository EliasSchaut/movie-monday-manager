import { Injectable } from "@nestjs/common";
import { MovieDBService } from "../../db_services/movies/movieDB.service";
import { HistoryDBService } from "../../db_services/histroy/historyDB.service";
import { WatchListDBService } from "../../db_services/watchlist/watchListDB.service";
import { MovieInfo, Prisma } from "@prisma/client";
import { VoteDBService } from "../../db_services/votes/voteDB.service";
import { Cron } from "@nestjs/schedule";
import { MovieInfoDBService } from "../../db_services/movie_infos/movieInfoDB.service";

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
      const movie_info_data = await this.movieInfoDBService.get(movie.imdb_id) as MovieInfo
      const data = {
        imdb_id: movie_info_data.imdb_id,
        title: movie_info_data.title,
        link: movie_info_data.link
      } as Prisma.HistoryCreateInput
      await this.historyDBService.add(data)
      await this.voteDBService.delete_all(movie.imdb_id)
      await this.watchListDBService.delete(movie.imdb_id)
      await this.movieDBService.delete(movie.imdb_id)
    }
  }

}
