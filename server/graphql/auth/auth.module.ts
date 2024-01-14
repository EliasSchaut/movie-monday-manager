import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PasswordService } from '@/common/services/password.service';
import { EmailService } from '@/common/services/email.service';

@Module({
  providers: [AuthService, AuthResolver, PasswordService, EmailService],
})
export class AuthModule {}
