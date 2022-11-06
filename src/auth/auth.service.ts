import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserDBService } from '../common/db_services/users/userDB.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserDBService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.get({
      username: username,
      id: undefined,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: any) {
    const payload = { username: user.username, name: user.name, password: user.password };
    try {
      await this.usersService.create(payload);

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException('Unable to create user');
      }
    }
  }
}
