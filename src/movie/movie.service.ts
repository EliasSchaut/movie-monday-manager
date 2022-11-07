import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Client } from "imdb-api";
import { MovieDBService } from "../common/db_services/movies/movieDB.service";
import { Prisma, User } from "@prisma/client";
import { UserDBService } from "../common/db_services/users/userDB.service";
import { VoteDBService } from "../common/db_services/votes/voteDB.service";

@Injectable()
export class MovieService {

  private readonly imdb: Client

  constructor(private readonly movieDBService: MovieDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService) {
    this.imdb = new Client({apiKey: process.env.OMDB_API_KEY})
  }

  async get(imdb_id: string) {
    try {
      return await this.imdb.get({ id: imdb_id })
    } catch (e) {
      throw new NotFoundException('Movie not found')
    }
  }

  async get_all() {
    const movies = await this.movieDBService.get_all()
    return await Promise.all(movies.map(async (movie) => {
      const user = await this.userDBService.get({ id: movie.proposer_id }) as User

      return {
        imdb_id: movie.imdb_id,
        title: movie.title,
        link: movie.link,
        year: movie.year,
        genre: movie.genre,
        proposer: user.name,
        proposer_id: user.id,
        createdAt: movie.createdAt,
        votes: await this.voteDBService.get_num_of_votes(movie.imdb_id)
      };
    }));
  }

  async save(imdb_id: string, proposer_id: string) {
    const movie = await this.get(imdb_id)
    const { username } : Prisma.UserCreateInput = await this.userDBService.get({id: Number(proposer_id)}) as User

    const movieDB_data: Prisma.MovieCreateInput = {
      imdb_id: imdb_id,
      title: movie.title,
      year: movie.year,
      genre: movie.genres,
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
