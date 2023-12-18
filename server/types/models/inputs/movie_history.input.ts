import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MovieHistoryInputModel {
  @Field(() => String)
  imdb_id!: string;

  @Field(() => Date, {
    defaultValue: new Date(),
    nullable: true
  })
  watched_at?: Date;
}
