import { Module } from '@nestjs/common';
import { UserDBService } from './userDB.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [UserDBService, PrismaService],
  exports: [UserDBService],
})
export class UserDBModule {}
