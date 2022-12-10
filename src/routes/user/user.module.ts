import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from "./user.service";
import { UserDBModule } from "../../common/db_services/users/userDB.module";
import { MovieDBModule } from "../../common/db_services/movies/movieDB.module";
import { VoteDBModule } from "../../common/db_services/votes/voteDB.module";
import { PasswordService } from "../../common/util_services/password.service";
import { EmailService } from "../../common/util_services/email.service";
import { GravatarService } from "../../common/util_services/gravatar.service";
import { WatchListDBModule } from "../../common/db_services/watchlist/watchListDB.module";

@Module({
  imports: [UserDBModule, MovieDBModule, VoteDBModule, WatchListDBModule],
  controllers: [UserController],
  providers: [UserService, PasswordService, EmailService, GravatarService],
})
export class UserModule {}
