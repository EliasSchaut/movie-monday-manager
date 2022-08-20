import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('profile')
export class ProfileController {
    constructor() {}

    @UseGuards(JwtAuthGuard)
    @Get()
    getProfile(@Request() req: any) {
      return req.user;
    }
}
