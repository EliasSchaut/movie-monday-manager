import { Controller, Delete, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { VoteService } from "./vote.service";

@Controller('vote')
export class VoteController {

  constructor(private readonly voteService: VoteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get_votes(@Request() req: any) {
    return this.voteService.get_votes(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':imdb_id')
  async vote(@Param('imdb_id') imdb_id: string, @Request() req: any) {
    return this.voteService.vote(imdb_id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':imdb_id')
  async unvote(@Param('imdb_id') imdb_id: string, @Request() req: any) {
    return this.voteService.unvote(imdb_id, req.user);
  }

}
