import { Injectable } from '@nestjs/common';
import generator from 'generate-password';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  public static readonly CHALLENGE_LENGTH = 20;

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public generate_challenge(): string {
    return generator.generate({
      length: PasswordService.CHALLENGE_LENGTH,
      strict: true,
    });
  }
}
