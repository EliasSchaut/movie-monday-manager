import { Injectable } from "@nestjs/common";
import { MovieDBService } from "../../db_services/movies/movieDB.service";
import { WatchListDBService } from "../../db_services/watchlist/watchListDB.service";
import { VoteDBService } from "../../db_services/votes/voteDB.service";

@Injectable()
export class WatchListJob {

  private readonly num_of_movies = Number(process.env.NUM_OF_MOVIES as string);

  constructor(private readonly movieDBService: MovieDBService,
              private readonly voteDBService: VoteDBService,
              private readonly watchListDBService: WatchListDBService) {}

  async run() {

    console.log("WatchListJob dispatched")
  }

}
