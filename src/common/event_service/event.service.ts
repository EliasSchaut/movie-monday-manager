import { Injectable } from "@nestjs/common";

@Injectable()
export class EventService {

  constructor() {}

  async init() {
    await this.init_event_watch_list()
    await this.init_event_history()
  }

  private async init_event_watch_list() {

  }


  private async init_event_history() {

  }
}