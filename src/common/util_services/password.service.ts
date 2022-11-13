import { Injectable } from "@nestjs/common";

const bcrypt = require('bcrypt');
import { createHmac } from 'crypto'

@Injectable()
export class PasswordService {

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  hash_md5(username: string): string {
    const trim = username.trim().toLowerCase();
    return createHmac('md5', trim).digest('hex');
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}