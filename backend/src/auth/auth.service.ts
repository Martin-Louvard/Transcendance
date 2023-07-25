import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { env } from 'process';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private readonly usersService: UsersService) {}
    
    //Need to find the right type for the Promise return
    async login(username: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({where:{username}});
        if (!user) {
            throw new NotFoundException(`No user found for username: ${username}`);
        }
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        //strip the password from the user object
        let { password, ...result} = user;
        const payload = { sub: user.id, username: user.username };
        return {...result, access_token: await this.jwtService.signAsync(payload)};
    }

    async login42(user)
    {
        let { password, ...result} = user;
        const payload = { sub: user.id, username: user.username };
        return {...result, access_token: await this.jwtService.signAsync(payload)};
    }

    async auth42(params: {code:string}): Promise<any>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: "authorization_code",
                client_id: env.VITE_42API_UID,
                client_secret: env.VITE_42API_SECRET,
                code: params.code,
                redirect_uri: 'http://localhost:3001/auth/42login'
            })
          };

          try{
            const response = await fetch('https://api.intra.42.fr/oauth/token', requestOptions);
            const data = await response.json();
            const token_42 = data.access_token ;
            const userInfo =  await this.get42UserInfo(token_42)
            const dbUser = await this.prisma.user.findUnique({where:{email42: userInfo.email}});
            if (dbUser)
            {
                let { password, ...result} = dbUser;
                const payload = { sub: dbUser.id, username: dbUser.username };
                return {...result, access_token: await this.jwtService.signAsync(payload)};
            }
            return (userInfo)

          }catch(err) {
            return(err);
          }
    }

    async get42UserInfo(token: string): Promise<any>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        };

        try{
            const response = await fetch('https://api.intra.42.fr/v2/me', requestOptions)
            const data = await response.json();
            return (data);

        }catch(err) {
            return(err);
        }
    }
}
