import { Controller, Post, UseGuards, Get, Param, Body } from "@nestjs/common";
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { JwtUser } from "../../types/jwtuser.type";
import { User } from "../../common/decorators/user.decorator";
import { PasswordDto } from "../../types/user.dto/password.dto";
import { RegisterDto } from "../../types/user.dto/register.dto";
import { ResDto } from "../../types/res.dto";
import { LoginDto } from "../../types/user.dto/login.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

/**
 * Controller for authentication related routes
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'POST issue jwt access token by providing username (email) and password' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: JwtUser, @Body() body: LoginDto): Promise<{access_token: string}> {
    return await this.authService.login(user);
  }

  @ApiOperation({ summary: 'POST register new user' })
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<ResDto> {
    return await this.authService.register(body)
  }

  @ApiOperation({ summary: 'GET confirm email address by providing user challenge' })
  @Get('confirm/:challenge')
  async confirm(@Param('challenge') challenge: string): Promise<ResDto> {
    return await this.authService.confirm(challenge)
  }

  @ApiOperation({ summary: 'GET request a password reset by providing an username (email)' })
  @Get('reset/:username')
  async pw_reset_request(@Param('username') username: string): Promise<ResDto> {
    return await this.authService.pw_reset_request(username)
  }

  @ApiOperation({ summary: 'POST reset password by providing user challenge and new password' })
  @Post('reset/:challenge')
  async pw_reset(@Param('challenge') challenge: string, @Body() body: PasswordDto): Promise<ResDto> {
    return await this.authService.pw_reset(challenge, body.password)
  }
}
