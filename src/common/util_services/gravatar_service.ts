import { Injectable } from "@nestjs/common";
import { PasswordService } from "./password.service";

@Injectable()
export class GravatarService {

  constructor(private readonly passwordService: PasswordService) {}

  generate_gravatar_url(username: string): string {
    const trim = username.trim().toLowerCase();
    const hash = this.passwordService.hash_md5(trim);
    return `https://www.gravatar.com/avatar/${hash}`;
  }

}
