import { Injectable } from "@nestjs/common";
import { MovieDBService } from "../../db_services/movies/movieDB.service";
import { HistoryDBService } from "../../db_services/histroy/historyDB.service";
import { WatchListDBService } from "../../db_services/watchlist/watchListDB.service";

@Injectable()
export class HistoryJob {

  constructor(private readonly movieDBService: MovieDBService,
              private readonly historyDBService: HistoryDBService,
              private readonly watchListDBService: WatchListDBService) {}

  async run() {
    console.log("HistoryJob dispatched")
  }

}
