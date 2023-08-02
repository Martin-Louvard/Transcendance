import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly usersService;
    constructor(prisma: PrismaService, jwtService: JwtService, usersService: UsersService);
    login(username: string, pass: string): Promise<any>;
    auth42(code: any): Promise<any>;
    get42UserInfo(token: string): Promise<any>;
}
