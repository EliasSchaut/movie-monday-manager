import { Field, ObjectType } from '@nestjs/graphql';
import { TmdbSearchType } from '@/types/movie/tmdb_search.type';

@ObjectType({
  description: 'Movie with reduced information as on result of a search query',
})
export class MovieSearchItemModel {
  constructor(movie_search: TmdbSearchType) {
    this.imdb_id = movie_search.id;
    this.title = movie_search.title;
    this.description = movie_search.description;
    this.poster_link = movie_search.image;
  }

  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String)
  imdb_id!: string;

  @Field(() => String, {
    nullable: true,
  })
  poster_link?: string;
}
