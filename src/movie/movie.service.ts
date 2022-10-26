import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Client } from "imdb-api";
import { MovieDBService } from "../common/db_services/movies/movieDB.service";
import { Prisma, User } from "@prisma/client";
import { UsersService } from "../common/db_services/users/users.service";

@Injectable()
export class MovieService {

  private readonly imdb: Client

  constructor(private readonly movieDBService: MovieDBService,
              private readonly usersService: UsersService) {
    this.imdb = new Client({apiKey: process.env.OMDB_API_KEY})
  }

  async get(imdb_id: string) {
    try {
      return await this.imdb.get({ id: imdb_id })
    } catch (e) {
      throw new NotFoundException('Movie not found')
    }
  }

  async save(imdb_id: string, proposer_id: string) {
    const movie = await this.get(imdb_id)
    const { username } : Prisma.UserCreateInput = await this.usersService.get({id: Number(proposer_id)}) as User

    const movieDB_data: Prisma.MovieCreateInput = {
      imdbID: imdb_id,
      title: movie.title,
      link: movie.imdburl,
      proposer: { connect: { username } } as Prisma.UserCreateNestedOneWithoutMovieInput
    }

    try {
      return await this.movieDBService.add(movieDB_data)
    } catch (e) {
      throw new ConflictException('Movie already exists')
    }
  }

}
