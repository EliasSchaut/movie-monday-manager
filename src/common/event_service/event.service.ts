import { scheduleJob } from "node-schedule"
import { Injectable } from "@nestjs/common";
import { HistoryJob } from "./jobs/history.job";
import { WatchListJob } from "./jobs/watchlist.job";

@Injectable()
export class EventService {

  constructor(private readonly historyJob: HistoryJob,
              private readonly watchListJob: WatchListJob) {}

  init() {
    this.init_event_watch_list()
    this.init_event_history()
  }

  private init_event_watch_list() {
    scheduleJob(process.env.SCHEDULE_WATCHLIST as string, this.watchListJob.run)
  }


  private init_event_history() {
    scheduleJob(process.env.SCHEDULE_HISTORY as string, this.historyJob.run)
  }
}