import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MovieModule } from './movie/movie.module';
import { VoteModule } from './vote/vote.module';
import { EventService } from "./common/event_service/event.service";

@Module({
  imports: [AuthModule, UserModule, MovieModule, VoteModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    })
  ],
  providers: [EventService],
})
export class AppModule {
  constructor(private readonly eventService: EventService) {
    this.eventService.init()
  }
}
