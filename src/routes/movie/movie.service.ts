import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Client } from "imdb-api";
import { MovieDBService } from "../../common/db_services/movies/movieDB.service";
import { Prisma, User, Movie } from "@prisma/client";
import { UserDBService } from "../../common/db_services/users/userDB.service";
import { VoteDBService } from "../../common/db_services/votes/voteDB.service";
import { VoteService } from "../vote/vote.service";
import { HistoryDBService } from "../../common/db_services/histroy/historyDB.service";
import { WatchListDBService } from "../../common/db_services/watchlist/watchListDB.service";
import { MovieExtType } from "../../types/movie.types/movie_ext.type";
import { WatchlistExtType } from "../../types/movie.types/watchlist_ext.type";
import { ResDto } from "../../types/res.dto";
import { imdb_id_pattern } from "../../common/validation/patterns/imdb_id.pattern";

@Injectable()
export class MovieService {

  private readonly imdb: Client
  private readonly max_proposeable_movies = Number(process.env.MAX_PROPOSEABLE_MOVIES)

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
      const votes = await this.voteDBService.get_num_of_votes(movie.imdb_id)

      return {
        imdb_id: movie.imdb_id,
        title: movie.title,
        link: movie.link,
        year: movie.year,
        genre: movie.genre,
        proposer: user.name,
        proposer_id: user.id,
        createdAt: movie.createdAt,
        votes
      } as MovieExtType;
    }));
  }

  async save(imdb_id: string, proposer_id: number) {
    if (!imdb_id_pattern.test(imdb_id)) {
      throw new ForbiddenException('Invalid imdb id. The id must start with tt and contain only numbers!')
    }

    if (await this.histroyDBService.has(imdb_id)) {
      throw new ConflictException('Movie is already in history')
    }

    if (await this.movieDBService.has(imdb_id)) {
      throw new ConflictException('Movie is already in database')
    }

    if ((await this.movieDBService.get_all_proposed(proposer_id)).length >= this.max_proposeable_movies) {
      throw new ConflictException('You have reached the maximum number of proposed movies! ' +
        'You can only propose ' + this.max_proposeable_movies + ' movies!')
    }

    const movie = await this.get(imdb_id)
    const { username } : Prisma.UserCreateInput = await this.userDBService.get({id: proposer_id}) as User

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
        return this.voteService.vote(movie.imdb_id, proposer_id)
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
      return { message: "Successfully deleted movie: " + movie.title, show_alert: true } as ResDto
    } else {
      throw new NotFoundException('Movie not found or you are not the proposer')
    }
  }

  async get_watchlist() {
    const watchlist = await this.watchlistDBService.get_all()

    return await Promise.all(watchlist.map(async (watch_movie) => {
      const movie = await this.movieDBService.get(watch_movie.imdb_id) as Movie
      const votes = await this.voteDBService.get_votes_movie(movie.imdb_id)
      return {
        imdb_id: movie.imdb_id,
        title: movie.title,
        link: movie.link,
        start_time: watch_movie.start_time,
        interested: votes.map((vote) => vote.user.id)
      } as WatchlistExtType
    }))
  }

  async get_history() {
    return await this.histroyDBService.get_all()
  }
}
