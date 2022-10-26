import { Injectable } from '@nestjs/common';
import { MovieDBService } from "../common/db_services/movies/movieDB.service";
import { UserDBService } from "../common/db_services/users/userDB.service";
import { VoteDBService } from "../common/db_services/votes/voteDB.service";

@Injectable()
export class VoteService {

  constructor(private readonly movieDBService: MovieDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService) {}

  async vote(movieId: string, user: any) {
    return { movieId, user };
  }


}
