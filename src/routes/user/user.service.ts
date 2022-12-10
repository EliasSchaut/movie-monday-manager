import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { UserDBService } from "../../common/db_services/users/userDB.service";
import { Movie, Prisma, User } from "@prisma/client";
import { MovieDBService } from "../../common/db_services/movies/movieDB.service";
import { VoteDBService } from "../../common/db_services/votes/voteDB.service";
import { PasswordService } from "../../common/util_services/password.service";
import { EmailService } from "../../common/util_services/email.service";
import { GravatarService } from "../../common/util_services/gravatar.service";
import { WatchListDBService } from "../../common/db_services/watchlist/watchListDB.service";
import { ProfileDto } from "../../types/user.dto/profile.dto";
import { name_pattern } from "../../common/validation/patterns/name.pattern";
import { username_pattern } from "../../common/validation/patterns/username.pattern";
import { password_pattern } from "../../common/validation/patterns/password.pattern";
import cuid from "cuid";

@Injectable()
export class UserService {

  constructor(private readonly movieDBService: MovieDBService,
              private readonly userDBService: UserDBService,
              private readonly voteDBService: VoteDBService,
              private readonly watchListDBService: WatchListDBService,
              private readonly passwordService: PasswordService,
              private readonly emailService: EmailService,
              private readonly gravatarService: GravatarService) {}

  async get(user_id: number) {
    const { password, verified, challenge, pw_reset, ...result } = await this.userDBService.get({ id: user_id }) as User;
    return result
  }

  async get_public(user_id: number) {
    const { name, gravatar_url, use_gravatar } = await this.userDBService.get({ id: user_id }) as User;
    return { name, gravatar_url, use_gravatar };
  }

  async get_user_data(user_id: number) {
    const user = await this.userDBService.get({ id: user_id }) as User;
    const proposed_movies = await this.movieDBService.get_all_proposed(user_id);
    const votes = await this.voteDBService.get_votes_user(user_id);
    return { user, movies: proposed_movies, votes };
  }

  async change_profile(user_id: number, data: ProfileDto) {
    if (!name_pattern.test(data.name)) {
      throw new ForbiddenException("Invalid name! Name must be between 3 and 20 characters and start with a capital letter!");
    }

    const user = await this.userDBService.get({ id: user_id }) as User;
    const data_to_update = {
      name: data.name
    } as Prisma.UserUpdateInput;

    if (data.hasOwnProperty("use_gravatar") && data.use_gravatar) {
      data_to_update["use_gravatar"] = true;
      data_to_update["gravatar_url"] = this.gravatarService.generate_gravatar_url(user.username);

    } else {
      data_to_update["use_gravatar"] = false;
      data_to_update["gravatar_url"] = null;
    }

    await this.userDBService.update({ where: { id: user_id }, data: data_to_update });
    return { message: "Profile updated!", show_alert: true };
  }

  async email_opt_in(user_id: number, opt_in: boolean) {
    await this.userDBService.update({ where: { id: user_id },
      data: {
        email_opt_in: opt_in
      }
    });
    return { message: "Email option updated!", show_alert: true };
  }

  async change_password(user_id: number, password_new: string, password_old: string) {
    if (!password_pattern.test(password_new)) {
      throw new ForbiddenException("Invalid password! Password must be minimum eight characters, at least one letter and one number!");
    }

    const user = await this.userDBService.get({ id: user_id }) as User;
    if (await this.passwordService.compare(password_old, user.password)) {
      await this.userDBService.update({ where: { id: user_id },
        data: {
          password: await this.passwordService.hash(password_new),
        }
      });
      return { message: "Password updated! " +
          "The next time you log in, you will need to log in with your email address and new password.",
        show_alert: true };

    } else {
      throw new ForbiddenException("Invalid password");
    }
  }

  async change_username(user_id: number, new_username: string, password: string) {
    if (!username_pattern.test(new_username)) {
      throw new ForbiddenException("Invalid username! Username must be a valid email address!");
    }

    const user = await this.userDBService.get({ id: user_id }) as User;
    if ((user.username === new_username) || (await this.userDBService.has_user(new_username))) {
      throw new ConflictException("Email is already in use");
    }

    if (await this.passwordService.compare(password, user.password)) {
      const new_challenge = cuid();
      await this.userDBService.update({ where: { id: user_id },
        data: {
          username: new_username,
          verified: false,
          challenge: new_challenge,
          gravatar_url: this.gravatarService.generate_gravatar_url(new_username)
        }
      });
      const new_challenge_url = this.emailService.generate_challenge_url(new_challenge);
      await this.emailService.send_challenge(user.username, user.name, new_challenge_url);
      return { message: "Please confirm your new email address by clicking the link sent to your new inbox. " +
          "The next time you log in, you will need to log in with your new verified email address and password.",
        show_alert: true };

    } else {
      throw new ForbiddenException("Invalid password");
    }
  }

  async delete(user_id: number, password: string) {
    const watchlist = await this.watchListDBService.get_all()
    const watchlist_proposer_ids = await Promise.all(watchlist.map(async wl => {
      return ((await this.movieDBService.get(wl.imdb_id)) as Movie).proposer_id
    }));
    if (watchlist_proposer_ids.includes(user_id)) {
      throw new ForbiddenException("You cannot delete your account while you have movies in the watchlist");
    }

    const user = await this.userDBService.get({ id: user_id }) as User;
    if (await this.passwordService.compare(password, user.password)) {
      await this.voteDBService.delete_all_user(user_id);
      await this.movieDBService.delete_all_proposed(user_id);
      await this.userDBService.delete({ id: user_id });
      return { message: "Your account, votes and proposed movies has been deleted.", show_alert: true };

    } else {
      throw new ForbiddenException("Invalid password");
    }
  }
}
