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
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from 'src/types/generated/i18n.generated';

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

  async get(imdb_id: string, i18n: I18nContext<I18nTranslations>) {
    try {
      return await this.imdb.get({ id: imdb_id })
    } catch (e) {
      throw new NotFoundException(i18n.t('movie.exception.not_found'))
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

  async save(imdb_id: string, proposer_id: number, i18n: I18nContext<I18nTranslations>) {
    if (!imdb_id_pattern.test(imdb_id)) {
      throw new ForbiddenException(i18n.t('movie.exception.invalid_imdb_id'))
    }

    if (await this.histroyDBService.has(imdb_id)) {
      throw new ConflictException(i18n.t('movie.exception.conflict_history'))
    }

    if (await this.movieDBService.has(imdb_id)) {
      throw new ConflictException(i18n.t('movie.exception.conflict_movie'))
    }

    if ((await this.movieDBService.get_all_proposed(proposer_id)).length >= this.max_proposeable_movies) {
      throw new ConflictException(i18n.t('movie.exception.conflict_max_proposed', { args: {
        max_proposeable_movies: this.max_proposeable_movies
      } }))
    }

    const movie = await this.get(imdb_id, i18n)
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
        return this.voteService.vote(movie.imdb_id, proposer_id, i18n)
          .then((vote) => {
            return { movie, vote, message: i18n.t('movie.success.save'), show_alert: true }
          })
          .catch((e) => {
            this.movieDBService.delete(movie.imdb_id)
            throw e
          })
      })
    } catch (e) {
      throw new ConflictException(i18n.t('movie.exception.conflict_movie'))
    }
  }

  async delete(imdb_id: string, proposer_id: string, i18n: I18nContext<I18nTranslations>) {
    const movie = await this.movieDBService.get(imdb_id) as Movie
    const watchlist = await this.watchlistDBService.get_all()
    const watchlist_imdbs = watchlist.map((movie) => movie.imdb_id)

    if (watchlist_imdbs.includes(imdb_id)) {
      throw new ConflictException(i18n.t('movie.exception.conflict_watchlist'))
    }
    else if (movie.proposer_id === Number(proposer_id)) {
      await this.voteDBService.delete_all(imdb_id)
      await this.movieDBService.delete(imdb_id)
      return { message: i18n.t('movie.success.delete', {args: { title: movie.title }}), show_alert: true } as ResDto
    } else {
      throw new NotFoundException(i18n.t('movie.exception.not_found_or_not_proposer'))
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
