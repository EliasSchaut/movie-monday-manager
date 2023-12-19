import { Field, InputType } from '@nestjs/graphql';
import { IsImdbId } from '@/common/validation/decorators/IsImdbId.validation';

@InputType()
export class ImdbIdInputModel {
  @IsImdbId()
  @Field(() => String)
  imdb_id!: string;
}
