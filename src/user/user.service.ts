import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { UserDBService } from "../common/db_services/users/userDB.service";
import { Prisma, User } from "@prisma/client";
import { MovieDBService } from "../common/db_services/movies/movieDB.service";
import { VoteDBService } from "../common/db_services/votes/voteDB.service";
import { PasswordService } from "../common/util_services/password.service";
import { EmailService } from "../common/util_services/email.service";
import cuid from "cuid";

@Injectable()
export class UserService {

  constructor(private readonly movieDBService: MovieDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService,
              private readonly passwordService: PasswordService,
              private readonly emailService: EmailService) {}

  async get(user_id: number) {
    const { password, verified, challenge, ...result } = await this.userDBService.get({ id: user_id }) as User;
    return result
  }

  async get_user_data(user_id: number) {
    const user = await this.userDBService.get({ id: user_id }) as User;
    const proposed_movies = await this.movieDBService.get_all_proposed(user_id);
    const votes = await this.voteDBService.get_votes_user(user_id);
    return { user, movies: proposed_movies, votes };
  }

  async change_profile(user_id: number, data: any) {
    const data_to_update = {
      name: data.name
    } as Prisma.UserUpdateInput;

    if (data.use_gravatar && data.gravatar_url.length) {
      data_to_update["use_gravatar"] = data.use_gravatar;
      data_to_update["gravatar_url"] = data.gravatar_url;
    }

    await this.userDBService.update({ where: { id: user_id }, data: data_to_update });
    return { message: "Profile updated!", show_alert: true };
  }

  async change_password(user_id: number, data: any) {
    const user = await this.userDBService.get({ id: user_id }) as User;
    if (await this.passwordService.compare(data.old_password, user.password)) {
      await this.userDBService.update({ where: { id: user_id },
        data: {
          password: await this.passwordService.hash(data.password),
        }
      });
      return { message: "Password updated! " +
          "The next time you log in, you will need to log in with your email address and new password.",
        show_alert: true };

    } else {
      throw new ForbiddenException("Invalid password");
    }
  }

  async change_username(user_id: number, data: any) {
    const user = await this.userDBService.get({ id: user_id }) as User;
    if (user.username === data.username) {
      throw new ConflictException("Email is already in use");
    }

    if (await this.passwordService.compare(data.password, user.password)) {
      const new_challenge = cuid();
      await this.userDBService.update({ where: { id: user_id },
        data: {
          username: data.username,
          verified: false,
          challenge: new_challenge
        }
      });
      const new_challenge_url = this.emailService.generate_challenge_url(new_challenge);
      await this.emailService.sendChallenge(user.username, user.name, new_challenge_url);
      return { message: "Please confirm your new email address by clicking the link sent to your new inbox. " +
          "The next time you log in, you will need to log in with your new verified email address and password.",
        show_alert: true };

    } else {
      throw new ForbiddenException("Invalid password");
    }
  }

  async delete(user_id: number, data: any) {
    const user = await this.userDBService.get({ id: user_id }) as User;
    if (await this.passwordService.compare(data.password, user.password)) {
      await this.voteDBService.delete_all_user(user_id);
      await this.movieDBService.delete_all_proposed(user_id);
      await this.userDBService.delete({ id: user_id });
      return { message: "Your account, votes and proposed movies has been deleted.", show_alert: true };

    } else {
      throw new ForbiddenException("Invalid password");
    }
  }
}
