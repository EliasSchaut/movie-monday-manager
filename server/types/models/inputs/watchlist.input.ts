import { Field, InputType } from '@nestjs/graphql';
import { IsImdbId } from '@/common/validation/decorators/IsImdbId.validation';
import { IsDate } from 'class-validator';

@InputType()
export class WatchlistInputModel {
  @IsImdbId()
  @Field(() => String)
  imdb_id!: string;

  @IsDate()
  @Field(() => Date)
  start_time!: Date;
}
