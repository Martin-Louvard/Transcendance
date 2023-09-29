import { Injectable, NotFoundException, UnauthorizedException, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { env } from 'process';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private usersService: UsersService) {}
    
    //Need to find the right type for the Promise return
    async login(username: string, pass: string): Promise<any> {
        const userWithPass = await this.prisma.user.findUnique({where:{username}});
        if (!userWithPass) {
            throw new NotFoundException(`No user found for username: ${username}`);
        }
        const isPasswordValid = await bcrypt.compare(pass, userWithPass.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        //strip the password from the user object
        try {
            const user = await this.usersService.findOne(username);
            const payload = { id: user.id, username: user.username };
            const token = await this.jwtService.signAsync(payload);
            const userUpdate = {...user, access_token: token}
            return (userUpdate)
            //return {...user, access_token: };
        } catch(error) {
            return (error);
        }
    }

    async loginWith2fa(username: string,  code: string) {
        const isCodeValid = await 
        this.usersService.isTwoFactorAuthenticationCodeValid(
          code,
          username,
        );

        if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }

      const user = await this.usersService.findOne(username);
      return {...user}
    }

    async auth42(code): Promise<any>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: "authorization_code",
                client_id: env.VITE_42API_UID,
                client_secret: env.VITE_42API_SECRET,
                code: code,
                redirect_uri: 'http://localhost:3000/'
            })
          };

          try{
            const response = await fetch('https://api.intra.42.fr/oauth/token', requestOptions);
            const data = await response.json();
            const token_42 = data.access_token ;
            const userInfo =  await this.get42UserInfo(token_42)
            let dbUser = await this.usersService.createOrLogin42(userInfo);
            const payload = { id: dbUser.id, username: dbUser.username };
            return {...dbUser, access_token: await this.jwtService.signAsync(payload)};
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
