import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MovieModule } from './movie/movie.module';
import { VoteModule } from './vote/vote.module';
import { EventModule } from "./common/event_service/event.module";

@Module({
  imports: [AuthModule, UserModule, MovieModule, VoteModule, EventModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    })
  ],
})
export class AppModule {}
