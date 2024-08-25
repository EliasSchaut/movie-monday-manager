import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Max, Min } from 'class-validator';

@InputType()
export class MovieIdInputModel {
  @IsNumber()
  @Min(0)
  @Max(999999999)
  @Field(() => String)
  movie_id!: number;
}
