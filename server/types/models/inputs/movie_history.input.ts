import { Field, InputType } from '@nestjs/graphql';
import { IsImdbId } from '@/common/validation/decorators/IsImdbId.validation';

@InputType()
export class MovieHistoryInputModel {
  @IsImdbId()
  @Field(() => String)
  imdb_id!: string;

  @Field(() => Date, {
    defaultValue: new Date(),
    nullable: true,
  })
  watched_at?: Date;
}
