import { Injectable } from "@nestjs/common";
import { DiscordService } from "../../util_services/discord.service";
import { WatchListDBService } from "../../db_services/watchlist/watchListDB.service";
import { MovieDBService } from "../../db_services/movies/movieDB.service";
import { Movie } from "@prisma/client";

@Injectable()
export class AnnounceJob {

  private readonly announce;

  constructor(private readonly discordService: DiscordService,
              private readonly watchListDBService: WatchListDBService,
              private readonly movieDBService: MovieDBService) {
    this.announce = (watchlist: string[]) => `<@1041714399964041286>
Die Wahl ist durch, diese Filme werden geschaut:
${watchlist.join("\n")}

Mehr Infos siehe auch <https://movie.schaut.dev>

**Meine Adresse:**
HaDiKo, Zimmer E406 im Haus K2

Es gibt Getränke und Atmosphäre auf Spendenbasis!
  `;

  }

  async run() {
    console.log("Announce job started");
    const watchlist = await this.watchListDBService.get_all();
    const output = [] as string[];

    for (const movie of watchlist) {
      const movie_data = await this.movieDBService.get(movie.imdb_id) as Movie;
      const start_time = movie.start_time.toLocaleString();
      output.push(`${start_time} - ${movie_data.title}`);
    }

    await this.send_announce(this.announce(output));
  }

  private async send_announce(invite: string) {
    await this.discordService.send_message(invite);
  }
}
