import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { VoteService } from "./vote.service";
import { User } from "../../common/decorators/user.decorator";
import { JwtUser } from "../../types/jwtuser.type";
import { Vote } from "@prisma/client";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { I18n, I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "../../types/generated/i18n.generated";

/**
 * Controller for the vote routes
 */
@ApiTags('vote')
@Controller('vote')
export class VoteController {

  constructor(private readonly voteService: VoteService) {}

  @ApiOperation({ summary: 'GET imdb_ids for the movies, the given user voted for' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async get_votes(@User() user: JwtUser, @I18n() i18n: I18nContext<I18nTranslations>): Promise<string[]> {
    return this.voteService.get_votes_user(Number(user.id), i18n);
  }

  @ApiOperation({ summary: 'GET number of votes for a movie' })
  @Get(':imdb_id')
  async get_vote(@Param('imdb_id') imdb_id: string, @I18n() i18n: I18nContext<I18nTranslations>) : Promise<number> {
    return this.voteService.get_votes(imdb_id, i18n);
  }

  @ApiOperation({ summary: 'POST vote for a movie' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':imdb_id')
  async save_vote(@User() user: JwtUser, @Param('imdb_id') imdb_id: string, @I18n() i18n: I18nContext<I18nTranslations>) : Promise<Vote> {
    return this.voteService.vote(imdb_id, Number(user.id), i18n);
  }

  @ApiOperation({ summary: 'DELETE unvote for a movie' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':imdb_id')
  async unvote(@User() user: JwtUser, @Param('imdb_id') imdb_id: string, @I18n() i18n: I18nContext<I18nTranslations>) : Promise<Vote> {
    return this.voteService.unvote(imdb_id, Number(user.id), i18n);
  }

}
