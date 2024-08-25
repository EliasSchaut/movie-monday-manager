import { Field, InputType, Int } from '@nestjs/graphql';
import { MovieExternalIdsType } from '@/types/utils/movie.util';

@InputType()
export class MovieExternalIdInputModel implements MovieExternalIdsType {
  @Field(() => String, { nullable: process.env.MOVIE_API_TYPE == 'OMDB' })
  imdb_id?: string;

  @Field(() => Int, { nullable: process.env.MOVIE_API_TYPE != 'OMDB' })
  tmdb_id?: number;
}
