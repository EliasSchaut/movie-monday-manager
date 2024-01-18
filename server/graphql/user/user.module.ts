import { Module } from '@nestjs/common';
import { UserService } from '@/graphql/user/user.service';
import { UserResolver } from '@/graphql/user/user.resolver';
import { PasswordService } from '@/common/services/password.service';

@Module({
  providers: [UserService, UserResolver, PasswordService],
})
export class UserModule {}
