import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Response Model',
})
export class ResModel {
  @Field(() => Boolean, {
    description: 'Indicates if request was successful.',
    defaultValue: false,
    nullable: true,
  })
  success: boolean = false;

  @Field(() => String, {
    description: 'A response message.',
    nullable: true,
    defaultValue: '',
  })
  response: string = '';

  @Field(() => String, {
    description: 'A response code.',
    nullable: true,
    defaultValue: 'none',
  })
  code: 'info' | 'warn' | 'danger' | 'success' | 'none' = 'none';
}
