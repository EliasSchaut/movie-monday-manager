import { Field, ObjectType } from '@nestjs/graphql';
import { ResModel } from '@/types/models/res.model';

@ObjectType()
export class AuthModel extends ResModel {
  @Field(() => String, { description: 'The barrier token.', nullable: true })
  barrier_token?: string;

  @Field(() => Boolean, {
    description: 'Indicates if user is admin.',
    nullable: true,
  })
  is_admin?: boolean;
}
