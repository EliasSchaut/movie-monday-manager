import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthGuard } from './auth.guard';
import { PasswordService } from '@/common/services/password.service';
import { EmailService } from '@/common/services/email.service';

@Module({
  providers: [
    AuthService,
    AuthGuard,
    AuthResolver,
    PasswordService,
    EmailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
