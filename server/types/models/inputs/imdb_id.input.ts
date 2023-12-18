import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ImdbIdInputModel {
  @Field(() => String)
  imdb_id!: string;
}
