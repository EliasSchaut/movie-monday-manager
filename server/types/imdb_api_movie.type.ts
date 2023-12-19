export class ImdbApiMovieType {
  imdb_id!: string;
  lang_meta!: string;
  title!: string;
  year!: number;
  genre!: string;
  runtime!: number;

  plot?: string;
  actors?: string;
  director?: string;
  languages?: string;
  imdb_rate?: string;
  meta_score?: string;
  rotten_score?: string;
  poster_link?: string;
}
