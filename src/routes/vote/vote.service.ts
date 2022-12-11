import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MovieDBService } from "../../common/db_services/movies/movieDB.service";
import { UserDBService } from "../../common/db_services/users/userDB.service";
import { VoteDBService } from "../../common/db_services/votes/voteDB.service";
import { Movie, Prisma } from "@prisma/client";

@Injectable()
export class VoteService {

  private readonly max_votes = Number(process.env.MAX_VOTES)

  constructor(private readonly movieDBService: MovieDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService) {}

  async get_votes(imdb_id: string) {
    try {
      return await this.voteDBService.get_num_of_votes(imdb_id)
    } catch (e) {
      throw new InternalServerErrorException('Error getting votes')
    }
  }

  async get_votes_user(user_id: number) {
    try {
      return (await this.voteDBService.get_votes_user(user_id)).map(vote => vote.imdb_id)
    } catch (e) {
      throw new InternalServerErrorException('Error getting votes')
    }
  }

  async vote(imdb_id: string, user_id: number) {
    const num_of_votes = await this.voteDBService.num_of(user_id)
    if (num_of_votes >= this.max_votes) {
      throw new ConflictException(`You have already voted for the maximum number of movies! You can only vote for ${this.max_votes} movies`)
    }

    const voteDB_data: Prisma.VoteCreateInput = {
      movie: { connect: { imdb_id } } as Prisma.MovieCreateNestedOneWithoutVoteInput,
      user: { connect: { id: user_id } } as Prisma.UserCreateNestedOneWithoutVoteInput
    }

    try {
      return await this.voteDBService.add(voteDB_data)
    } catch (e) {
      throw new ConflictException('Vote already exists')
    }
  }

  async unvote(imdb_id: string, user_id: number) {
    const movie = await this.movieDBService.get(imdb_id) as Movie
    if (movie.proposer_id === user_id) {
      throw new ConflictException('You cannot unvote a movie you proposed')
    }

    const voteDB_data: Prisma.VoteWhereUniqueInput = {
      imdb_id_user_id: { imdb_id, user_id: user_id }
    }

    try {
      return await this.voteDBService.delete(voteDB_data)
    } catch (e) {
      throw new ConflictException('Vote does not exist')
    }
  }
}
