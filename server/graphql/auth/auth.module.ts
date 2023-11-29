import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthGuard } from './auth.guard';
import { PasswordService } from '@/common/util/password.service';
import { EmailService } from '@/common/util/email.service';
import { PrismaService } from '@/common/db/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION as string },
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    AuthResolver,
    PrismaService,
    PasswordService,
    EmailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
