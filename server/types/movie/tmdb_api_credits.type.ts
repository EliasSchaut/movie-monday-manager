export class TmdbApiCreditsType {
  constructor(tmdb_movie_credits: any) {
    this.director = tmdb_movie_credits.crew.find(
      (crew: any) => crew.job === 'Director',
    )?.name;
    this.writer = tmdb_movie_credits.crew.find(
      (crew: any) => crew.job === 'Writer',
    )?.name;
    this.actors = tmdb_movie_credits.cast
      .map((actor: any) => actor.name)
      .slice(0, 5);
  }

  director?: string;
  writer?: string;
  actors?: string[];
}
