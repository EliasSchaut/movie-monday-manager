import { Injectable } from "@nestjs/common";
import { WatchListDBService } from "../../db_services/watchlist/watchListDB.service";
import { VoteDBService } from "../../db_services/votes/voteDB.service";
import { MovieDBService } from "../../db_services/movies/movieDB.service";
import { parseExpression } from "cron-parser"
import { Movie, Prisma } from "@prisma/client";
import { Cron } from "@nestjs/schedule";
import { AnnounceJob } from "./announce.job";

@Injectable()
export class WatchListJob {

  private readonly num_of_movies = Number(process.env.NUM_OF_MOVIES as string);
  private readonly pause_time = Number(process.env.PAUSE_TIME_MIN as string) * 60000;

  constructor(private readonly voteDBService: VoteDBService,
              private readonly watchListDBService: WatchListDBService,
              private readonly movieDBService: MovieDBService,
              private readonly announceJob: AnnounceJob) {}

  @Cron(process.env.SCHEDULE_WATCHLIST as string)
  async run() {
    console.log('Watchlist job started');
    const top_movies = await this.voteDBService.get_most_voted(this.num_of_movies)
    let start_time = parseExpression(process.env.SCHEDULE_START as string).next().toDate()

    for (const movie of top_movies) {
      const data = {
        movie: { connect: { imdb_id: movie.imdb_id } },
        start_time: start_time,
      } as Prisma.WatchListCreateInput
      await this.watchListDBService.add(data)

      const movie_data = await this.movieDBService.get(movie.imdb_id) as Movie
      const round_duration_ms = (Math.round(movie_data.runtime/15) * 15) * 60000
      start_time = new Date(start_time.getTime() + round_duration_ms + this.pause_time)
    }

    await this.announceJob.run()
  }
}
