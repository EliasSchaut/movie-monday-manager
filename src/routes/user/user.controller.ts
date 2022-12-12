import { Controller, Get, UseGuards, Post, Delete, Param, Body } from "@nestjs/common";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from "./user.service";
import { User } from "../../common/decorators/user.decorator";
import { JwtUser } from "../../types/jwtuser.type";
import { ProfileDto } from "../../types/user.dto/profile.dto";
import { EmailOptInDto } from "../../types/user.dto/email_opt_in.dto";
import { PasswordDto } from "../../types/user.dto/password.dto";
import { LoginDto } from "../../types/user.dto/login.dto";
import { PasswordNewDto } from "../../types/user.dto/password_new.dto";
import { ResDto } from "../../types/res.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

/**
 * Controller for user related routes
 */
@ApiTags('user')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'GET user data' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@User() user: JwtUser) {
    return await this.userService.get(Number(user.id));
  }

  @ApiOperation({ summary: 'POST update profile information (name, gravatar)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async update_profile(@User() user: JwtUser, @Body() body: ProfileDto): Promise<ResDto> {
    return await this.userService.change_profile(Number(user.id), body);
  }

  @ApiOperation({ summary: 'POST update email_opt_in (set/unset on newsletter)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('email_opt_in')
  async email_opt_in(@User() user: JwtUser, @Body() body: EmailOptInDto): Promise<ResDto> {
    return await this.userService.email_opt_in(Number(user.id), Boolean(body.email_opt_in));
  }

  @ApiOperation({ summary: 'DELETE user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@User() user: JwtUser, @Body() body: PasswordDto): Promise<ResDto> {
    return await this.userService.delete(Number(user.id), body.password);
  }

  @ApiOperation({ summary: 'GET all saved user data' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('data')
  async get_data(@User() user: JwtUser) {
    return await this.userService.get_user_data(Number(user.id));
  }

  @ApiOperation({ summary: 'POST update username (email)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('username')
  async change_username(@User() user: JwtUser, @Body() body: LoginDto): Promise<ResDto> {
    return await this.userService.change_username(Number(user.id), body.username, body.password);
  }

  @ApiOperation({ summary: 'POST update password' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('password')
  async change_password(@User() user: JwtUser, @Body() body: PasswordNewDto): Promise<ResDto> {
    return await this.userService.change_password(Number(user.id), body.password, body.password_old);
  }

  @ApiOperation({ summary: 'GET check if bearer token is valid' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('check')
  async check_profile() {
    return true;
  }

  @ApiOperation({ summary: 'GET public user data from given user_id' })
  @Get(':user_id')
  async get_user(@Param('user_id') user_id: string) {
    return await this.userService.get_public(Number(user_id));
  }
}
