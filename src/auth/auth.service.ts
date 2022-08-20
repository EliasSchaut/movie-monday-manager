import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
const bcrypt = require('bcrypt')

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.get({email: email})
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}