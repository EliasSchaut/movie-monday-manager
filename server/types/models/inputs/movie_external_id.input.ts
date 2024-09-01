import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ImdbId,
  MovieExternalIdsType,
  TmdbId,
} from '@/types/movie/movie_type.utils';
import { IsImdbId } from '@/common/validation/decorators/IsImdbId.validation';
import { IsMovieId } from '@/common/validation/decorators/IsMovieId.validation';

@InputType()
export class MovieExternalIdInputModel implements MovieExternalIdsType {
  @IsImdbId()
  @Field(() => String, { nullable: true })
  imdb_id?: ImdbId;

  @IsMovieId()
  @Field(() => Int, { nullable: true })
  tmdb_id?: TmdbId;
}
