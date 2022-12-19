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
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "../../types/generated/i18n.generated";

@Injectable()
export class AuthService {
  constructor(
    private readonly userDBService: UserDBService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly passwordService: PasswordService,
  ) {
  }

  async validateUser(username: string, password: string, i18n: I18nContext<I18nTranslations>): Promise<any> {
    const user = await this.userDBService.get({
      username: username
    });
    if (user && (await this.passwordService.compare(password, user.password))) {
      if (!user.verified) {
        const challenge_url = this.emailService.generate_challenge_url(user.challenge);
        await this.emailService.send_challenge(user.username, user.name, challenge_url);
        throw new ForbiddenException(i18n.t('auth.exception.forbidden_not_verified'));
      }

      const { password, ...result } = user;
      return result;
    }
    throw new ForbiddenException(i18n.t('auth.exception.forbidden_login'));
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterDto, i18n: I18nContext<I18nTranslations>) {
    if (!name_pattern.test(user.name) || !username_pattern.test(user.username) || !password_pattern.test(user.password)) {
      throw new ForbiddenException(i18n.t('auth.exception.forbidden_invalid_registration'));
    }

    const payload = { username: user.username, name: user.name, password: user.password };
    try {
      const userDB = await this.userDBService.create(payload);
      const challenge_url = `${process.env.FRONTEND_URL}login/${userDB.challenge}`;
      await this.emailService.send_challenge(user.username, user.name, challenge_url);
      return { message: i18n.t('auth.success.register'), show_alert: true };

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException(i18n.t('auth.exception.conflict_username_exists'));
      } else {
        throw new InternalServerErrorException(i18n.t('auth.exception.internal_server_error_register'));
      }
    }
  }

  async confirm(challenge: string, i18n: I18nContext<I18nTranslations>) {
    const user = await this.userDBService.get({
      challenge: challenge,
    });
    if (user && !user.verified) {
      await this.userDBService.update({
        where: { challenge },
        data: { verified: true },
      })
      return { message: i18n.t('auth.success.verified'), show_alert: true };
    }
    throw new NotFoundException(i18n.t('auth.exception.not_found_challenge'));
  }

  async pw_reset_request(username: string, i18n: I18nContext<I18nTranslations>) {
    const user = await this.userDBService.get({ username })
    if (user) {
      const challenge = cuid();
      const challenge_url = this.emailService.generate_pw_challenge_url(challenge);
      await this.userDBService.update( {where: { username }, data: { pw_reset: true, challenge } } )
      await this.emailService.send_password_reset(user.username, user.name, challenge_url);
    }

    return {
      message: i18n.t('auth.success.password_reset_request'),
      show_alert: true
    };
  }

  async pw_reset(challenge: string, password: string, i18n: I18nContext<I18nTranslations>) {
    if (!password_pattern.test(password)) {
      throw new ForbiddenException(i18n.t('auth.exception.invalid_password'));
    }

    const user = await this.userDBService.get({ challenge })
    if (user && user.pw_reset) {
      const hashed_password = await this.passwordService.hash(password);
      await this.userDBService.update({ where: { challenge }, data: { password: hashed_password, pw_reset: false } } )
      return { message: i18n.t('auth.success.password_reset'), show_alert: true };
    }
    throw new NotFoundException(i18n.t('auth.exception.not_found_password_reset'));
  }
}
