import { ConflictException, Injectable } from "@nestjs/common";
import { MovieDBService } from "../common/db_services/movies/movieDB.service";
import { UserDBService } from "../common/db_services/users/userDB.service";
import { VoteDBService } from "../common/db_services/votes/voteDB.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class VoteService {

  constructor(private readonly movieDBService: MovieDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService) {}

  async vote(imdb_id: string, user: any) {
    const num_of_votes = await this.voteDBService.num_of(user.id)
    if (num_of_votes >= Number(process.env.MAX_VOTES)) {
      throw new ConflictException(`You have already voted for the maximum number (${process.env.MAX_VOTES}) of movies`)
    }

    const voteDB_data: Prisma.VoteCreateInput = {
      movie: { connect: { imdbID: imdb_id } } as Prisma.MovieCreateNestedOneWithoutVoteInput,
      user: { connect: { id: user.id } } as Prisma.UserCreateNestedOneWithoutVoteInput
    }

    try {
      return await this.voteDBService.add(voteDB_data)
    } catch (e) {
      throw new ConflictException('Vote already exists')
    }
  }
}
