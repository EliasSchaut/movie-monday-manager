import { Module } from '@nestjs/common';
import { UsersModule } from './common/db_services/users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ProfileModule } from './profile/profile.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

console.log(join(__dirname, '..', 'client/dist'));

@Module({
  imports: [UsersModule, AuthModule, ProfileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
