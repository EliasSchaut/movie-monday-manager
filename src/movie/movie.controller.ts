import { Controller, Get, Param } from "@nestjs/common";
import { MovieService } from "./movie.service";

@Controller('movie')
export class MovieController {

  constructor(private readonly movieService: MovieService) {}

  @Get(':imdb_id')
  async get_media(@Param('imdb_id') imdb_id: string) {
    return await this.movieService.get(imdb_id)
  }

}
