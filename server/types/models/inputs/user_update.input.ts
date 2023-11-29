import { Field, InputType } from '@nestjs/graphql';
import { IsName } from '@/common/validation/decorators/IsName.validation';

@InputType()
export class UserUpdateInputModel {
  @IsName()
  @Field(() => String, { nullable: true })
  first_name?: string;

  @IsName()
  @Field(() => String, { nullable: true })
  last_name?: string;
}
