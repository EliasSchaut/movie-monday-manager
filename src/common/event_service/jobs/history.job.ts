import { Injectable } from "@nestjs/common";
import { MovieDBService } from "../../db_services/movies/movieDB.service";
import { HistoryDBService } from "../../db_services/histroy/historyDB.service";
import { WatchListDBService } from "../../db_services/watchlist/watchListDB.service";
import { Movie, Prisma } from "@prisma/client";
import { VoteDBService } from "../../db_services/votes/voteDB.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class HistoryJob {

  constructor(private readonly movieDBService: MovieDBService,
              private readonly historyDBService: HistoryDBService,
              private readonly watchListDBService: WatchListDBService,
              private readonly voteDBService: VoteDBService) {}

  @Cron(process.env.SCHEDULE_HISTORY as string)
  async run() {
    console.log('History job started');
    const watch_list = await this.watchListDBService.get_all()
    for (const movie of watch_list) {
      const movie_data = await this.movieDBService.get(movie.imdb_id) as Movie
      const data = {
        imdb_id: movie.imdb_id,
        title: movie_data.title,
        link: movie_data.link
      } as Prisma.HistoryCreateInput
      await this.historyDBService.add(data)
      await this.voteDBService.delete_all(movie.imdb_id)
      await this.watchListDBService.delete(movie.imdb_id)
      await this.movieDBService.delete(movie.imdb_id)
    }
  }

}
