import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { UserDBService } from '../../common/db_services/users/userDB.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { EmailService } from "../../common/util_services/email.service";
import { PasswordService } from "../../common/util_services/password.service";
import cuid from "cuid";
import { RegisterDto } from "../../types/user.dto/register.dto";
import { name_pattern } from "../../common/validation/patterns/name.pattern";
import { username_pattern } from "../../common/validation/patterns/username.pattern";
import { password_pattern } from "../../common/validation/patterns/password.pattern";

@Injectable()
export class AuthService {
  constructor(
    private readonly userDBService: UserDBService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly passwordService: PasswordService,
  ) {
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userDBService.get({
      username: username
    });
    if (user && (await this.passwordService.compare(password, user.password))) {
      if (!user.verified) {
        const challenge_url = this.emailService.generate_challenge_url(user.challenge);
        await this.emailService.send_challenge(user.username, user.name, challenge_url);
        throw new ForbiddenException('Email not verified. Please check your inbox! If you did not receive an email, please check your spam folder. If you still cannot find it, please contact us.');
      }

      const { password, ...result } = user;
      return result;
    }
    throw new ForbiddenException('Invalid username or password');
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterDto) {
    if (!name_pattern.test(user.name) || !username_pattern.test(user.username) || !password_pattern.test(user.password)) {
      throw new ForbiddenException('Invalid input. Your inputs failed to pass the validation checks.');
    }

    const payload = { username: user.username, name: user.name, password: user.password };
    try {
      const userDB = await this.userDBService.create(payload);
      const challenge_url = `${process.env.FRONTEND_URL}login/${userDB.challenge}`;
      await this.emailService.send_challenge(user.username, user.name, challenge_url);
      return {
        message: "Please confirm you email address by clicking the link that was sent to your inbox. " +
          "If you did not receive an email, please check your spam folder. " +
          "If you still cannot find it, try to log in to receive another confirmation mail!",
        show_alert: true
      };

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException('E-Mail already exists');
      } else {
        throw new InternalServerErrorException('Unable to create user');
      }
    }
  }

  async confirm(challenge: string) {
    const user = await this.userDBService.get({
      challenge: challenge,
    });
    if (user && !user.verified) {
      await this.userDBService.update({
        where: { challenge },
        data: { verified: true },
      })
      return { message: "Email successfully verified! You can now log in.", show_alert: true };
    }
    throw new NotFoundException('Email already verified or challenge not found');
  }

  async pw_reset_request(username: string) {
    const user = await this.userDBService.get({ username })
    if (user) {
      const challenge = cuid();
      const challenge_url = this.emailService.generate_pw_challenge_url(challenge);
      await this.userDBService.update( {where: { username }, data: { pw_reset: true, challenge } } )
      await this.emailService.send_password_reset(user.username, user.name, challenge_url);
    }

    return {
      message: "A password reset request was sent to the given email if this user account exists",
      show_alert: true
    };
  }

  async pw_reset(challenge: string, password: string) {
    if (!password_pattern.test(password)) {
      throw new ForbiddenException('Invalid new password. Password must be minimum eight characters, at least one letter and one number!');
    }

    const user = await this.userDBService.get({ challenge })
    if (user && user.pw_reset) {
      const hashed_password = await this.passwordService.hash(password);
      await this.userDBService.update({ where: { challenge }, data: { password: hashed_password, pw_reset: false } } )
      return { message: "Password successfully reset! You can now log in.", show_alert: true };
    }
    throw new NotFoundException('Password already reset or challenge not found');
  }
}
