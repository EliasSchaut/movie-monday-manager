import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MovieService } from "./movie.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "../../common/decorators/user.decorator";
import { JwtUser } from "../../types/jwtuser.type";
import { MovieExtType } from "../../types/movie.types/movie_ext.type";
import { WatchlistExtType } from "../../types/movie.types/watchlist_ext.type";
import { MovieInfo } from "@prisma/client";
import { ResDto } from "../../types/res.dto";
import { I18n, I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "../../types/generated/i18n.generated";
import { MovieSearchType } from "../../types/movie.types/movie_search.type";
import { HistoryWithoutLangType } from "../../types/movie.types/history_without_lang.type";

/**
 * Controller for movie related routes
 */
@ApiTags('movie')
@Controller('movie')
export class MovieController {

  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({ summary: 'GET all movies with its related data' })
  @Get('all')
  async get_all_media(@I18n() i18n: I18nContext<I18nTranslations>) : Promise<MovieExtType[]> {
    return await this.movieService.get_all(i18n)
  }

  @ApiOperation({ summary: 'GET all movies from watchlist with its related data' })
  @Get('watchlist')
  async get_watchlist(@I18n() i18n: I18nContext<I18nTranslations>) : Promise<WatchlistExtType[]> {
    return await this.movieService.get_watchlist(i18n)
  }

  @ApiOperation({ summary: 'GET all movies from history with its related data' })
  @Get('history')
  async get_history(@I18n() i18n: I18nContext<I18nTranslations>) : Promise<HistoryWithoutLangType[]> {
    return this.movieService.get_history(i18n);
  }

  @ApiOperation({ summary: 'POST returns up to 10 matching movies from input string' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('search')
  async search_movie(@Body() data: { search_input: string }, @I18n() i18n: I18nContext<I18nTranslations>) : Promise<MovieSearchType[]> {
    return await this.movieService.search(data.search_input, i18n)
  }

  @ApiOperation({ summary: 'GET information about a specific movie given by its imdb_id' })
  @Get(':imdb_id')
  async get_info(@Param('imdb_id') imdb_id: string, @I18n() i18n: I18nContext<I18nTranslations>) : Promise<MovieInfo> {
    return await this.movieService.get(imdb_id, i18n)
  }

  @ApiOperation({ summary: 'POST add a movie to the movie database by a given imdb_id. This is only possible if the movie is not already in the movie, watchlist or history database! The given user will be the proposer of the movie' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':imdb_id')
  async post_media(@User() user: JwtUser, @Param('imdb_id') imdb_id: string, @I18n() i18n: I18nContext<I18nTranslations>): Promise<{movie: MovieExtType}> {
    return await this.movieService.save(imdb_id, Number(user.id), i18n)
  }

  @ApiOperation({ summary: "DEL remove a movie from the movie database by a given imdb_id, when the given user is the proposer" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':imdb_id')
  async delete_media(@User() user: JwtUser, @Param('imdb_id') imdb_id: string, @I18n() i18n: I18nContext<I18nTranslations>) : Promise<ResDto> {
    return await this.movieService.delete(imdb_id, user.id, i18n)
  }
}
