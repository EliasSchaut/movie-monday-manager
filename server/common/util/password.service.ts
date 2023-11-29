import { Injectable } from '@nestjs/common';
import cuid from 'cuid';
const bcrypt = require('bcrypt');

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generate_challenge(): Promise<string> {
    return cuid();
  }
}
