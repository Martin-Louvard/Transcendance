import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}
    
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
}
