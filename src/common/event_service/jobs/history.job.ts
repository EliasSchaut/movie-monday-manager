import { Injectable } from "@nestjs/common";

@Injectable()
export class HistoryJob {

  constructor() {}

  async run() {
    console.log("HistoryEvent dispatched")
  }

}
