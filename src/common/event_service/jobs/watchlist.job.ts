import { Injectable } from "@nestjs/common";

@Injectable()
export class WatchListJob {

  constructor() {}

  async run() {
    console.log("WatchListJob dispatched")
  }

}
