import { Controller, Get, UseGuards, Request, Post, Delete, Param } from "@nestjs/common";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  /**
   * GET private user data
   * @param req contains the user id via the jwt auth guard
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Request() req: any) {
    return await this.userService.get(Number(req.user.id));
  }

  /**
   * POST update profile information (name, gravatar)
   * @param {Object} req contains the user id via the jwt auth guard and the new profile data
   * @param {string} req.user.id the user id provided by the jwt auth guard
   * @param {string} req.body.name the new name
   * @param {string} [req.body.use_gravatar] the new gravatar
   * @returns {Object} the response object
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async update_profile(@Request() req: any) {
    return await this.userService.change_profile(Number(req.user.id), req.body);
  }

  /**
   * POST update username (email)
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @Post('email_opt_in')
  async email_opt_in(@Request() req: any) {
    return await this.userService.email_opt_in(Number(req.user.id), Boolean(req.body.email_opt_in));
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Request() req: any) {
    return await this.userService.delete(Number(req.user.id), req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('data')
  async get_data(@Request() req: any) {
    return await this.userService.get_user_data(Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('username')
  async change_username(@Request() req: any) {
    return await this.userService.change_username(Number(req.user.id), req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('password')
  async change_password(@Request() req: any) {
    return await this.userService.change_password(Number(req.user.id), req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  async check_profile() {
    return true;
  }

  @Get(':user_id')
  async get_user(@Param('user_id') user_id: string) {
    return await this.userService.get_public(Number(user_id));
  }
}
