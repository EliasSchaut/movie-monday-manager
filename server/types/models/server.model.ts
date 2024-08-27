import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ServerOauthModel } from '@/types/models/server_oauth.model';
import { ServerSettingsModel } from '@/types/models/server_settings.model';
import { Server, ServerSettings } from '@prisma/client';

@ObjectType({
  description: 'Server Information',
})
export class ServerModel {
  constructor(
    server: Server & {
      settings?: ServerSettings | null;
      oauth?: ServerOauthModel[] | null;
    },
  ) {
    this.id = server.id;
    this.name = server.name;
    this.origin = server.origin;
    this.settings = server.settings
      ? new ServerSettingsModel(server.settings)
      : undefined;
    this.oauth = server.oauth ?? undefined;
  }

  @Field(() => Int, {
    description: 'Unique id number of server used for comparison',
  })
  id!: number;

  @Field(() => String, {
    description: 'Unique name of the server',
  })
  name!: string;

  @Field(() => String, {
    description: 'Origin URL of the server',
  })
  origin!: string;

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
