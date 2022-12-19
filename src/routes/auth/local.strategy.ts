import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "../../types/generated/i18n.generated";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const i18n = I18nContext.current() as I18nContext<I18nTranslations>;
    const user = await this.authService.validateUser(username, password, i18n);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
