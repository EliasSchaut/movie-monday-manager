import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Client } from "imdb-api";
import { MovieDBService } from "../common/db_services/movies/movieDB.service";
import { Prisma, User, Movie } from "@prisma/client";
import { UserDBService } from "../common/db_services/users/userDB.service";
import { VoteDBService } from "../common/db_services/votes/voteDB.service";
import { VoteService } from "../vote/vote.service";
import { HistoryDBService } from "../common/db_services/histroy/historyDB.service";
import { WatchListDBService } from "../common/db_services/watchlist/watchListDB.service";



@Injectable()
export class MovieService {

  private readonly imdb: Client

  constructor(private readonly movieDBService: MovieDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService,
              private readonly histroyDBService: HistoryDBService,
              private readonly watchlistDBService: WatchListDBService,
              private readonly voteService: VoteService) {
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
      proposer: { connect: { username } } as Prisma.UserCreateNestedOneWithoutMovieInput,
      runtime: Number((movie.runtime.split(" "))[0])
    }

    try {
      return this.movieDBService.add(movieDB_data).then((movie) => {
        return this.voteService.vote(movie.imdb_id, Number(proposer_id))
          .then((vote) => {
            return { movie, vote }
          })
          .catch((e) => {
            this.movieDBService.delete(movie.imdb_id)
            throw e
          })
      })
    } catch (e) {
      throw new ConflictException('Movie already exists')
    }
  }

  async delete(imdb_id: string, proposer_id: string) {
    const movie = await this.movieDBService.get(imdb_id) as Movie
    const watchlist = await this.watchlistDBService.get_all()
    const watchlist_imdbs = watchlist.map((movie) => movie.imdb_id)

    if (watchlist_imdbs.includes(imdb_id)) {
      throw new ConflictException('Movie is in watchlist')
    }
    else if (movie.proposer_id === Number(proposer_id)) {
      await this.voteDBService.delete_all(imdb_id)
      await this.movieDBService.delete(imdb_id)
      return { success: true }
    } else {
      throw new NotFoundException('Movie not found or you are not the proposer')
    }
  }

  async get_watchlist() {
    return await this.watchlistDBService.get_all()
  }

  async get_history() {
    return await this.histroyDBService.get_all()
  }
}
