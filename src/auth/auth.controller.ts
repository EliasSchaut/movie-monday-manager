import { Controller, Request, Post, UseGuards, Get, Param, NotImplementedException } from "@nestjs/common";
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  async register(@Request() req: any) {
    return await this.authService.register(req.body)
  }

  @Get('confirm/:challenge')
  async confirm(@Param('challenge') challenge: string) {
    return await this.authService.confirm(challenge)
  }

  @Get('reset/:username')
  async pw_reset_request(@Param('username') username: string) {
    return await this.authService.pw_reset_request(username)
  }

  @Post('reset/:challenge')
  async pw_reset(@Param('challenge') challenge: string, @Request() req: any) {
    throw new NotImplementedException()
  }
}
