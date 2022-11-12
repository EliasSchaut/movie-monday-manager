import { Module } from '@nestjs/common';
import { UserDBService } from './userDB.service';
import { PrismaService } from '../prisma.service';
import { PasswordService } from "../../util_services/password.service";

@Module({
  providers: [UserDBService, PrismaService, PasswordService],
  exports: [UserDBService],
})
export class UserDBModule {}
