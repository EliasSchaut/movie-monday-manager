import { Module } from '@nestjs/common';
import { AuthModule } from './routes/auth/auth.module';
import { UserModule } from './routes/user/user.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { MovieModule } from './routes/movie/movie.module';
import { VoteModule } from './routes/vote/vote.module';
import { EventModule } from "./common/event_service/event.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule, UserModule, MovieModule, VoteModule, EventModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}
