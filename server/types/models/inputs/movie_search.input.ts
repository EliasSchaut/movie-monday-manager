import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class MovieSearchInputModel {
  @Length(1, 200)
  @Field(() => String)
  query!: string;
}
