import { Module } from '@nestjs/common';
import { UserDBService } from "@/common/db_services/users/userDB.service";
import { PrismaService } from "@/common/db_services/prisma.service";
import { PasswordService } from "@/common/util_services/password.service";

@Module({
  providers: [UserDBService, PrismaService, PasswordService],
  exports: [UserDBService],
})
export class UserDBModule {}
