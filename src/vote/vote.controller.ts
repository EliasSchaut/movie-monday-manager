import { Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { VoteService } from "./vote.service";

@Controller('vote')
export class VoteController {

  constructor(private readonly voteService: VoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':movieId')
  async vote(@Param('movieId') movieId: string, @Request() req: any) {
    console.log("yes")
    return this.voteService.vote(movieId, req.user);
  }

}
