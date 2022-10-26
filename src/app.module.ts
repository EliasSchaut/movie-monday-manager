import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ProfileModule } from './profile/profile.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MovieModule } from './movie/movie.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [AuthModule, ProfileModule, MovieModule, VoteModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    })
  ],
  providers: [PrismaService],

})
export class AppModule {}
