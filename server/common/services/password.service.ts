import { Injectable } from '@nestjs/common';
import generator from 'generate-password';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class PasswordService {
  public static readonly CHALLENGE_LENGTH = 20;
  private static readonly SALT_ROUNDS = 10;

  public static async hash_md5(password: string): Promise<string> {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  public static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordService.SALT_ROUNDS);
  }

  public static async compare(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public static generate_challenge(): string {
    return generator.generate({
      length: PasswordService.CHALLENGE_LENGTH,
      strict: true,
    });
  }
}
