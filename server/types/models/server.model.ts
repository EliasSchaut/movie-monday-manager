import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ServerOauthModel } from '@/types/models/server_oauth.model';
import { ServerSettingsModel } from '@/types/models/server_settings.model';
import { Server } from '@prisma/client';

@ObjectType({
  description: 'Server Information',
})
export class ServerModel {
  constructor(server: Server) {
    this.id = server.id;
    this.title = server.title;
    this.name = server.name;
    this.desc = server.desc;
  }

  @Field(() => Int, {
    description: 'Unique id number of server used for comparison',
  })
  id!: number;

  @Field(() => String, {
    description: 'Visible title of the server',
  })
  title!: string;

  @Field(() => String, {
    description: 'Unique name of the server',
  })
  name!: string;

  @Field(() => String, {
    description: 'Description of the server',
    nullable: true,
  })
  desc?: string | null;

  @Field(() => ServerSettingsModel, {
    nullable: true,
  })
  settings?: ServerSettingsModel;

  @Field(() => [ServerOauthModel], {
    description: 'Oauth information',
    nullable: true,
  })
  oauth?: ServerOauthModel[];
}
