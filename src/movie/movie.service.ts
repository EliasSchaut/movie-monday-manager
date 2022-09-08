import { Injectable } from '@nestjs/common';
import imdb_api, { Client } from "imdb-api";

@Injectable()
export class MovieService {
  private imdb: Client

  constructor() {
    this.imdb = new imdb_api.Client({apiKey: process.env.OMDB_API_KEY});
  }

  async get(imdb_id: string) {
    const movie = this.imdb.get({id: imdb_id})
    console.log(movie)
    return movie
  }

  async save(imdb_id: string) {
    const movie = await this.get(imdb_id)
    console.log(movie)
    return movie
  }

}
