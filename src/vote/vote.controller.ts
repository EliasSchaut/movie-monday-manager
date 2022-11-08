import { Controller, Delete, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { VoteService } from "./vote.service";

@Controller('vote')
export class VoteController {

  constructor(private readonly voteService: VoteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get_votes(@Request() req: any) {
    return this.voteService.get_votes_user(Number(req.user.id));
  }

  @Get(':imdb_id')
  async get_vote(@Param('imdb_id') imdb_id: string) {
    return this.voteService.get_votes(imdb_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':imdb_id')
  async save_vote(@Param('imdb_id') imdb_id: string, @Request() req: any) {
    return this.voteService.vote(imdb_id, Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':imdb_id')
  async unvote(@Param('imdb_id') imdb_id: string, @Request() req: any) {
    return this.voteService.unvote(imdb_id, Number(req.user.id));
  }

}
