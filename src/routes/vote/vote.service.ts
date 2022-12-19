import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MovieDBService } from "../../common/db_services/movies/movieDB.service";
import { UserDBService } from "../../common/db_services/users/userDB.service";
import { VoteDBService } from "../../common/db_services/votes/voteDB.service";
import { Movie, Prisma } from "@prisma/client";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "../../types/generated/i18n.generated";

@Injectable()
export class VoteService {

  private readonly max_votes = Number(process.env.MAX_VOTES)

  constructor(private readonly movieDBService: MovieDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService) {}

  async get_votes(imdb_id: string, i18n: I18nContext<I18nTranslations>) {
    try {
      return await this.voteDBService.get_num_of_votes(imdb_id)
    } catch (e) {
      throw new InternalServerErrorException(i18n.t('vote.exception.internal_server_error'))
    }
  }

  async get_votes_user(user_id: number, i18n: I18nContext<I18nTranslations>) {
    try {
      return (await this.voteDBService.get_votes_user(user_id)).map(vote => vote.imdb_id)
    } catch (e) {
      throw new InternalServerErrorException(i18n.t('vote.exception.internal_server_error'))
    }
  }

  async vote(imdb_id: string, user_id: number, i18n: I18nContext<I18nTranslations>) {
    const num_of_votes = await this.voteDBService.num_of(user_id)
    if (num_of_votes >= this.max_votes) {
      throw new ConflictException(i18n.t('vote.exception.conflict_max_voted', { args: { max_votes: this.max_votes } }))
    }

    const voteDB_data: Prisma.VoteCreateInput = {
      movie: { connect: { imdb_id } } as Prisma.MovieCreateNestedOneWithoutVoteInput,
      user: { connect: { id: user_id } } as Prisma.UserCreateNestedOneWithoutVoteInput
    }

    try {
      return await this.voteDBService.add(voteDB_data)
    } catch (e) {
      throw new ConflictException(i18n.t('vote.exception.conflict_exists'))
    }
  }

  async unvote(imdb_id: string, user_id: number, i18n: I18nContext<I18nTranslations>) {
    const movie = await this.movieDBService.get(imdb_id) as Movie
    if (movie.proposer_id === user_id) {
      throw new ConflictException(i18n.t('vote.exception.conflict_unvote_proposed'))
    }

    const voteDB_data: Prisma.VoteWhereUniqueInput = {
      imdb_id_user_id: { imdb_id, user_id: user_id }
    }

    try {
      return await this.voteDBService.delete(voteDB_data)
    } catch (e) {
      throw new ConflictException(i18n.t('vote.exception.conflict_not_exists'))
    }
  }
}
