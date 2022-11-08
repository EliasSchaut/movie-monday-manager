import { Controller, Request, Post, UseGuards, Get, Param } from "@nestjs/common";
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
}
