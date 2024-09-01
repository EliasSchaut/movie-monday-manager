import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { EmailService } from '@/common/services/email.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/graphql/auth/auth.guard';
import { I18nLangResolver } from '@/common/middleware/i18n.resolver';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    EmailService,
    I18nLangResolver,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
