import { Module } from '@nestjs/common';
import { UserService } from '@/graphql/user/user.service';
import { UserResolver } from '@/graphql/user/user.resolver';
import { EmailService } from '@/common/services/email.service';

@Module({
  providers: [UserService, UserResolver, EmailService],
})
export class UserModule {}
