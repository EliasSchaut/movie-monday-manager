export class ImdbApiSearchType {
  // imdb_id
  id!: string;

  // = "Title" because of title search
  resultType!: string;

  // title of movie
  title!: string;

  // year and director
  description!: string;

  // link to poster
  image!: string;
}
