import { Controller, Get, UseGuards, Post, Delete, Param, Body } from "@nestjs/common";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from "./user.service";
import { User } from "../common/decorators/user.decorator";
import { JwtUser } from "../common/types/jwtuser.type";
import { ProfileDto } from "../common/types/user.dto/profile.dto";
import { EmailOptInDto } from "../common/types/user.dto/email_opt_in.dto";
import { PasswordDto } from "../common/types/user.dto/password.dto";
import { LoginDto } from "../common/types/user.dto/login.dto";
import { PasswordNewDto } from "../common/types/user.dto/password_new.dto";
import { ResDto } from "../common/types/res.dto";

/**
 * Controller for user related routes
 */
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  /**
   * GET user data
   * @param user
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@User() user: JwtUser) {
    return await this.userService.get(Number(user.id));
  }

  /**
   * POST update profile information (name, gravatar)
   * @param user
   * @param body
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async update_profile(@User() user: JwtUser, @Body() body: ProfileDto): Promise<ResDto> {
    return await this.userService.change_profile(Number(user.id), body);
  }

  /**
   * POST update email_opt_in (set/unset on newsletter)
   * @param user
   * @param body
   */
  @UseGuards(JwtAuthGuard)
  @Post('email_opt_in')
  async email_opt_in(@User() user: JwtUser, @Body() body: EmailOptInDto): Promise<ResDto> {
    return await this.userService.email_opt_in(Number(user.id), Boolean(body.email_opt_in));
  }

  /**
   * DELETE user
   * @param user
   * @param body
   */
  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@User() user: JwtUser, @Body() body: PasswordDto): Promise<ResDto> {
    return await this.userService.delete(Number(user.id), body.password);
  }

  /**
   * GET all saved user data
   * @param user
   */
  @UseGuards(JwtAuthGuard)
  @Get('data')
  async get_data(@User() user: JwtUser) {
    return await this.userService.get_user_data(Number(user.id));
  }

  /**
   * POST update username (email)
   * @param user
   * @param body
   */
  @UseGuards(JwtAuthGuard)
  @Post('username')
  async change_username(@User() user: JwtUser, @Body() body: LoginDto): Promise<ResDto> {
    return await this.userService.change_username(Number(user.id), body.username, body.password);
  }

  /**
   * POST update password
   * @param user
   * @param body
   */
  @UseGuards(JwtAuthGuard)
  @Post('password')
  async change_password(@User() user: JwtUser, @Body() body: PasswordNewDto): Promise<ResDto> {
    return await this.userService.change_password(Number(user.id), body.password, body.password_old);
  }

  /**
   * GET check if bearer token is valid
   */
  @UseGuards(JwtAuthGuard)
  @Get('check')
  async check_profile() {
    return true;
  }

  /**
   * GET public user data from given user_id
   * @param user_id
   */
  @Get(':user_id')
  async get_user(@Param('user_id') user_id: string) {
    return await this.userService.get_public(Number(user_id));
  }
}
