import { Controller, Post, UseGuards, Get, Param, Body } from "@nestjs/common";
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { JwtUser } from "../../types/jwtuser.type";
import { User } from "../../common/decorators/user.decorator";
import { PasswordDto } from "../../types/user.dto/password.dto";
import { RegisterDto } from "../../types/user.dto/register.dto";
import { ResDto } from "../../types/res.dto";

/**
 * Controller for authentication related routes
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * PRIVATE POST issue jwt access token by providing username (email) and password
   * @param user
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: JwtUser): Promise<{access_token: string}> {
    return await this.authService.login(user);
  }

  /**
   * PUBLIC POST register new user
   * @param body
   */
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<ResDto> {
    return await this.authService.register(body)
  }

  /**
   * PUBLIC GET confirm email address by providing user challenge
   * @param challenge
   */
  @Get('confirm/:challenge')
  async confirm(@Param('challenge') challenge: string): Promise<ResDto> {
    return await this.authService.confirm(challenge)
  }

  /**
   * PUBLIC GET request a password reset by providing an username (email)
   * @param username
   */
  @Get('reset/:username')
  async pw_reset_request(@Param('username') username: string): Promise<ResDto> {
    return await this.authService.pw_reset_request(username)
  }

  /**
   * PUBLIC POST reset password by providing user challenge and new password
   * @param challenge
   * @param body
   */
  @Post('reset/:challenge')
  async pw_reset(@Param('challenge') challenge: string, @Body() body: PasswordDto): Promise<ResDto> {
    return await this.authService.pw_reset(challenge, body.password)
  }
}
