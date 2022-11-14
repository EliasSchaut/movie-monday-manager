import { Injectable } from "@nestjs/common";

const bcrypt = require('bcrypt');
import md5 from "crypto-js/md5";

@Injectable()
export class PasswordService {

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  hash_md5(username: string): string {
    const trim = username.trim().toLowerCase();
    return md5(trim).toString();
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}