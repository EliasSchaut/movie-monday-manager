import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthService } from './auth.service';
import { UserDBModule } from '../common/db_services/users/userDB.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stategy';
import { LoggerMiddleware } from "../common/middleware/logger.middleware";

@Module({
  imports: [
    UserDBModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('auth/');
  }
}
