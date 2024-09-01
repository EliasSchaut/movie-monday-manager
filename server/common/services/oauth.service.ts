import { Injectable } from '@nestjs/common';
import { generators, Issuer } from 'openid-client';
import { ServerService } from '@/graphql/server/server.service';
import { OAuthType } from '@/types/auth/oauth.type';
import { ServerOauthModel } from '@/types/models/server_oauth.model';

@Injectable()
export class OAuthService {
  private readonly SCOPE = 'openid profile email';
  private readonly code_verifier = generators.codeVerifier();
  private oauths: OAuthType[] | null = null;

  constructor(private readonly serverService: ServerService) {
    this.serverService.find_oauth_many_all_servers().then((oauths) => {
      this.oauths = oauths;
    });
  }

  private async connect_oauth(oauth: ServerOauthModel) {
    const issuer = await Issuer.discover(oauth.issuer_url);
    const client = new issuer.Client({
      client_id: oauth.client_id,
      client_secret: oauth.client_secret,
    });

    const code_challenge = generators.codeChallenge(this.code_verifier);
    client.authorizationUrl({
      scope: this.SCOPE,
      code_challenge,
      code_challenge_method: 'S256',
    });
  }
}
