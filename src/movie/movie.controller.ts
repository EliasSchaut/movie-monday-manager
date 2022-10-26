import { Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('movie')
export class MovieController {

  constructor(private readonly movieService: MovieService) {}

  @Get('all')
  async get_all_media() {
    return await this.movieService.get_all()
  }

  @Get(':imdb_id')
  async get_media(@Param('imdb_id') imdb_id: string) {
    return await this.movieService.get(imdb_id)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':imdb_id')
  async post_media(@Param('imdb_id') imdb_id: string, @Request() req: any) {
    return await this.movieService.save(imdb_id, req.user.id)
  }
}
