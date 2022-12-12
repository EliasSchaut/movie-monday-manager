import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { VoteService } from "./vote.service";
import { User } from "../../common/decorators/user.decorator";
import { JwtUser } from "../../types/jwtuser.type";
import { Vote } from "@prisma/client";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

/**
 * Controller for the vote routes
 */
@ApiTags('vote')
@Controller('vote')
export class VoteController {

  constructor(private readonly voteService: VoteService) {}

  /**
   * PRIVATE GET imdb_ids for the movies, the given user voted for
   * @param user
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async get_votes(@User() user: JwtUser): Promise<string[]> {
    return this.voteService.get_votes_user(Number(user.id));
  }

  /**
   * PUBLIC GET number of votes for a movie
   * @param imdb_id
   */
  @Get(':imdb_id')
  async get_vote(@Param('imdb_id') imdb_id: string) : Promise<number> {
    return this.voteService.get_votes(imdb_id);
  }

  /**
   * PRIVATE POST vote for a movie
   * @param user
   * @param imdb_id
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':imdb_id')
  async save_vote(@User() user: JwtUser, @Param('imdb_id') imdb_id: string) : Promise<Vote> {
    return this.voteService.vote(imdb_id, Number(user.id));
  }

  /**
   * PRIVATE DELETE unvote for a movie
   * @param user
   * @param imdb_id
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':imdb_id')
  async unvote(@User() user: JwtUser, @Param('imdb_id') imdb_id: string) : Promise<Vote> {
    return this.voteService.unvote(imdb_id, Number(user.id));
  }

}
