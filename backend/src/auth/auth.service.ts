import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        //strip the password from the user object
        let { password, ...result} = user;
        const payload = { sub: user.id, username: user.username };
        return {...result, access_token: await this.jwtService.signAsync(payload)};
    }
}
