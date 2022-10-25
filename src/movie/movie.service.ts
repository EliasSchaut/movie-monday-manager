import { Injectable } from '@nestjs/common';
import { Client } from "imdb-api";
import { MovieDBService } from "../common/db_services/movies/movieDB.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class MovieService {

  private readonly imdb: Client

  constructor(private readonly movieDBService: MovieDBService) {
    this.imdb = new Client({apiKey: process.env.OMDB_API_KEY});
  }

  async get(imdb_id: string) {
    const movie = await this.imdb.get({id: imdb_id})
    console.log(movie)
    return movie
  }

  async save(imdb_id: string, proposer_id: string) {
    const movie = await this.get(imdb_id)
    console.log(movie)

    const movieDB_data = {
      imdbID: imdb_id,
      title: movie.title,
      link: "",
      proposer_id: proposer_id,
      proposer: ""
    } as Prisma.MovieCreateInput

    return this.movieDBService.add(movieDB_data)
  }

}
