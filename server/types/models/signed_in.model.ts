import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignedInModel {
  constructor(barrier_token: string, is_admin = false) {
    this.barrier_token = barrier_token;
    this.is_admin = is_admin;
  }

  @Field(() => String, { description: 'The barrier token.', nullable: true })
  barrier_token?: string;

  @Field(() => Boolean, {
    description: 'Indicates if user is admin.',
    nullable: true,
  })
  is_admin?: boolean;
}
