import { Injectable } from '@nestjs/common';
import generator from 'generate-password';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generate_challenge(): string {
    return generator.generate({
      length: 20,
      strict: true,
    });
  }
}
