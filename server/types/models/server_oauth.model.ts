import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Oauth information',
})
export class ServerOauthModel {
  @Field(() => Number, {
    description: 'Unique id number of server used for comparison',
    nullable: true,
  })
  id?: number;

  @Field(() => String, { description: 'Name of oauth', nullable: true })
  name?: string;

  @Field(() => String, { description: 'Client id of oauth', nullable: true })
  client_id?: string;

  @Field(() => String, {
    description:
      'Hidden client secret of oauth. Only accessible when using secret-api-key.',
    nullable: true,
  })
  client_secret?: string;
}
