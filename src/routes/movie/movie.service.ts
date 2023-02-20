import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { I18nContext } from "nestjs-i18n";
import { Prisma, User, Movie, MovieInfo } from "@prisma/client";

import { MovieDBService } from "@/common/db_services/movies/movieDB.service";
import { UserDBService } from "@/common/db_services/users/userDB.service";
import { VoteDBService } from "@/common/db_services/votes/voteDB.service";
import { VoteService } from "@/routes/vote/vote.service";
import { HistoryDBService } from "@/common/db_services/histroy/historyDB.service";
import { WatchListDBService } from "@/common/db_services/watchlist/watchListDB.service";
import { MovieExtType } from "@/types/movie.types/movie_ext.type";
import { WatchlistExtType } from "@/types/movie.types/watchlist_ext.type";
import { ResDto } from "@/types/res.dto";
import { imdb_id_pattern } from "@/common/validation/patterns/imdb_id.pattern";
import { I18nTranslations } from "@/types/generated/i18n.generated";
import { MovieSearchType } from "@/types/movie.types/movie_search.type";
import { MovieInfoDBService } from "@/common/db_services/movie_infos/movieInfoDB.service";
import { ImdbApiService } from "@/common/util_services/imdb_api.service";

@Injectable()
export class MovieService {

  private readonly max_proposeable_movies = Number(process.env.MAX_PROPOSEABLE_MOVIES);

  constructor(private readonly movieDBService: MovieDBService,
              private readonly movieInfoDBService: MovieInfoDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService,
              private readonly histroyDBService: HistoryDBService,
              private readonly watchlistDBService: WatchListDBService,
              private readonly voteService: VoteService,
              private readonly imdbApiService: ImdbApiService) {
  }

  async get(imdb_id: string, i18n: I18nContext<I18nTranslations>): Promise<MovieInfo> {
    try {
      return await this.movieInfoDBService.get(imdb_id, i18n.lang) as MovieInfo;
    } catch (e) {
      throw new NotFoundException(i18n.t("movie.exception.not_found"));
    }
  }

  async get_ext(imdb_id: string, i18n: I18nContext<I18nTranslations>): Promise<MovieExtType> {
    const movie = await this.movieDBService.get(imdb_id) as Movie;
    const user = await this.userDBService.get({ id: movie.proposer_id }) as User;
    const votes = await this.voteDBService.get_num_of_votes(movie.imdb_id);
    const movie_info = await this.movieInfoDBService.get(movie.imdb_id, i18n.lang) as MovieInfo;

    return {
      imdb_id: movie.imdb_id,
      title: movie_info.title,
      link: movie_info.link,
      year: movie_info.year,
      genre: movie_info.genre,
      proposer: user.name,
      proposer_id: movie.proposer_id,
      director: movie_info.director,
      actors: movie_info.actors,
      imdb_rate: movie_info.imdb_rate,
      meta_score: movie_info.meta_score,
      rotten_score: movie_info.rotten_score,
      languages: movie_info.languages,
      created_at: movie.created_at,
      votes: votes
    } as MovieExtType;
  }

  async get_all(i18n: I18nContext<I18nTranslations>): Promise<MovieExtType[]> {
    const imdb_ids = await this.movieDBService.get_all_imdb();

    return await Promise.all(imdb_ids.map(async (imdb_id) => {
      return await this.get_ext(imdb_id, i18n);
    }));
  }

  async search(search_input: string, i18n: I18nContext<I18nTranslations>): Promise<MovieSearchType[]> {
    if (search_input.length < 3) {
      throw new ForbiddenException(i18n.t("movie.exception.invalid_search_length"));
    }

    return await this.imdbApiService.search(search_input, i18n.lang);
  }

  async save(imdb_id: string, proposer_id: number, i18n: I18nContext<I18nTranslations>) {
    if (!imdb_id_pattern.test(imdb_id)) {
      throw new ForbiddenException(i18n.t("movie.exception.invalid_imdb_id"));
    }

    if (await this.histroyDBService.has(imdb_id)) {
      throw new ConflictException(i18n.t("movie.exception.conflict_history"));
    }

    if (await this.movieDBService.has(imdb_id)) {
      throw new ConflictException(i18n.t("movie.exception.conflict_movie"));
    }

    if ((await this.movieDBService.get_all_proposed(proposer_id)).length >= this.max_proposeable_movies) {
      throw new ConflictException(i18n.t("movie.exception.conflict_max_proposed", {
        args: {
          max_proposeable_movies: this.max_proposeable_movies
        }
      }));
    }

    const movies_info_imdb_api = await this.imdbApiService.get_all_langs(imdb_id);
    const { username }: Prisma.UserCreateInput = await this.userDBService.get({ id: proposer_id }) as User;

    const movieDB_data: Prisma.MovieCreateInput = {
      imdb_id: imdb_id,
      proposer: { connect: { username } } as Prisma.UserCreateNestedOneWithoutMovieInput,
    }

    movies_info_imdb_api.map((movie) => {
      return {
        imdb_id: imdb_id,
        language: movie.language,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        link: movie.link,
        runtime: Number(movie.runtime),
        director: movie.director,
        actors: movie.actors,
        imdb_rate: movie.imdb_rate,
        meta_score: movie.meta_score,
        rotten_score: movie.rotten_score,
        poster: movie.poster,
        plot: movie.plot,
        languages: movie.languages,
      } as Prisma.MovieInfoCreateInput;
    })

    console.log(movies_info_imdb_api)

    await this.movieDBService.add(movieDB_data).catch(() => {
      throw new ConflictException(i18n.t("movie.exception.conflict_movie"))
    })

    await this.voteService.vote(imdb_id, proposer_id, i18n).catch((e) => {
      console.error(e)
      this.movieDBService.delete(imdb_id);
      throw new InternalServerErrorException(e);
    })

    await this.movieInfoDBService.add(movies_info_imdb_api).catch((e) => {
      console.error(e)
      this.movieDBService.delete(imdb_id);
      this.voteService.unvote(imdb_id, proposer_id, i18n);
      throw new InternalServerErrorException(e)
    })

    return { movie: await this.get_ext(imdb_id, i18n), message: i18n.t("movie.success.save"), show_alert: true };
  }

  async delete(imdb_id: string, proposer_id: number, i18n: I18nContext<I18nTranslations>) {
    const movie = await this.movieDBService.get(imdb_id) as Movie;
    const movie_info = await this.movieInfoDBService.get(imdb_id, i18n.lang) as MovieInfo;
    const watchlist = await this.watchlistDBService.get_all();
    const watchlist_imdbs = watchlist.map((movie) => movie.imdb_id);

    if (watchlist_imdbs.includes(imdb_id)) {
      throw new ConflictException(i18n.t("movie.exception.conflict_watchlist"));
    } else if (movie.proposer_id === proposer_id) {
      await this.voteDBService.delete_all(imdb_id);
      await this.movieDBService.delete(imdb_id);
      return { message: i18n.t("movie.success.delete", { args: { title: movie_info.title } }), show_alert: true } as ResDto;
    } else {
      throw new NotFoundException(i18n.t("movie.exception.not_found_or_not_proposer"));
    }
  }

  async get_watchlist(i18n: I18nContext<I18nTranslations>) {
    const watchlist = await this.watchlistDBService.get_all();

    return await Promise.all(watchlist.map(async (watch_movie) => {
      const movie = await this.movieDBService.get(watch_movie.imdb_id) as Movie;
      const movie_info = await this.movieInfoDBService.get(watch_movie.imdb_id, i18n.lang) as MovieInfo;
      const votes = await this.voteDBService.get_votes_movie(movie.imdb_id);
      return {
        imdb_id: movie.imdb_id,
        title: movie_info.title,
        link: movie_info.link,
        start_time: watch_movie.start_time,
        interested: votes.map((vote) => vote.user.id)
      } as WatchlistExtType;
    }));
  }

  async get_history(i18n: I18nContext<I18nTranslations>) {
    return this.histroyDBService.get_all_without_lang(i18n.lang);
  }
}
