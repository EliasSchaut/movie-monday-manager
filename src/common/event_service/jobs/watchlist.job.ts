import { Injectable } from "@nestjs/common";
import { WatchListDBService } from "../../db_services/watchlist/watchListDB.service";
import { VoteDBService } from "../../db_services/votes/voteDB.service";

@Injectable()
export class WatchListJob {

  private readonly num_of_movies = Number(process.env.NUM_OF_MOVIES as string);

  constructor(private readonly voteDBService: VoteDBService,
              private readonly watchListDBService: WatchListDBService) {}

  async run() {
    const top_movies = await this.voteDBService.get_most_voted(this.num_of_movies)
    for (const movie of top_movies) {
      await this.watchListDBService.add(movie.imdb_id)
    }
  }
}
