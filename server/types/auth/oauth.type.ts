import { ServerOauthModel } from '@/types/models/server_oauth.model';
import { ServerOAuth } from '@prisma/client';

export class OAuthType {
  constructor(oauths: { id: number; oauths: ServerOAuth[] }) {
    this.server_id = oauths.id;
    this.oauths = oauths.oauths.map((o) => new ServerOauthModel(o));
  }

  server_id!: number;
  oauths!: ServerOauthModel[];
}
