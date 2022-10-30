import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MovieDBService } from "../common/db_services/movies/movieDB.service";
import { UserDBService } from "../common/db_services/users/userDB.service";
import { VoteDBService } from "../common/db_services/votes/voteDB.service";
import { Prisma, User } from "@prisma/client";

@Injectable()
export class VoteService {

  constructor(private readonly movieDBService: MovieDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService) {}

  async get_votes(user: User) {
    try {
      return await this.voteDBService.get_votes(user.id)
    } catch (e) {
      throw new InternalServerErrorException('Error getting votes')
    }
  }

  async vote(imdb_id: string, user: any) {
    const num_of_votes = await this.voteDBService.num_of(user.id)
    if (num_of_votes >= Number(process.env.MAX_VOTES)) {
      throw new ConflictException(`You have already voted for the maximum number (${process.env.MAX_VOTES}) of movies`)
    }

    const voteDB_data: Prisma.VoteCreateInput = {
      movie: { connect: { imdb_id } } as Prisma.MovieCreateNestedOneWithoutVoteInput,
      user: { connect: { id: user.id } } as Prisma.UserCreateNestedOneWithoutVoteInput
    }

    try {
      return await this.voteDBService.add(voteDB_data)
    } catch (e) {
      throw new ConflictException('Vote already exists')
    }
  }

  async unvote(imdb_id: string, user: any) {
    const voteDB_data: Prisma.VoteWhereUniqueInput = {
      imdb_id_user_id: { imdb_id, user_id: user.id }
    }

    try {
      return await this.voteDBService.delete(voteDB_data)
    } catch (e) {
      throw new ConflictException('Vote does not exist')
    }
  }
}
