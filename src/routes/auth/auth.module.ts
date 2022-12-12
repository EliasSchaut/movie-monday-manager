import { Module } from "@nestjs/common";
import { AuthService } from './auth.service';
import { UserDBModule } from '../../common/db_services/users/userDB.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stategy';
import { EmailService } from "../../common/util_services/email.service";
import { PasswordService } from "../../common/util_services/password.service";

@Module({
  imports: [
    UserDBModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, EmailService, PasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
