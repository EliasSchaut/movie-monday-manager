import { Field, ObjectType } from '@nestjs/graphql';
import { MovieSearchType } from '@/types/movie/movie_search.type';

@ObjectType({
  description: 'Movie with reduced information as on result of a search query',
})
export class MovieSearchItemModel {
  constructor(movie_search: MovieSearchType) {
    Object.assign(this, movie_search);
  }

  @Field(() => String)
  title!: string;

  @Field(() => String)
  poster_path!: string;

  @Field(() => String)
  release_date!: string;

  @Field(() => String, { nullable: true })
  plot_overview!: string | null;

  @Field(() => String, { nullable: true })
  tmdb_id!: number | null;

  @Field(() => String, { nullable: true })
  imdb_id!: string | null;

  @Field(() => String)
  lang_meta!: string;
}
