"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("./../prisma/prisma.service");
const bcrypt = require("bcrypt");
const process_1 = require("process");
let AuthService = exports.AuthService = class AuthService {
    constructor(prisma, jwtService, usersService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async login(username, pass) {
        const user = await this.prisma.user.findUnique({ where: { username }, include: { friends: true, games: true, JoinedChatChannels: true } });
        if (!user) {
            throw new common_1.NotFoundException(`No user found for username: ${username}`);
        }
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        let { password, ...result } = user;
        const payload = { sub: user.id, username: user.username };
        return { ...result, access_token: await this.jwtService.signAsync(payload) };
    }
    async login42(user) {
        let { password, ...result } = user;
        const payload = { sub: user.id, username: user.username };
        return { ...result, access_token: await this.jwtService.signAsync(payload) };
    }
    async auth42(code) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: "authorization_code",
                client_id: process_1.env.VITE_42API_UID,
                client_secret: process_1.env.VITE_42API_SECRET,
                code: code,
                redirect_uri: 'http://localhost:3000/'
            })
        };
        try {
            const response = await fetch('https://api.intra.42.fr/oauth/token', requestOptions);
            const data = await response.json();
            const token_42 = data.access_token;
            const userInfo = await this.get42UserInfo(token_42);
            let dbUser = await this.prisma.user.findUnique({ where: { email42: userInfo.email }, include: { friends: true, games: true, JoinedChatChannels: true } });
            if (!dbUser) {
                await this.prisma.user.create({ data: { username: userInfo.login, email42: userInfo.email, email: userInfo.email } });
                dbUser = await this.prisma.user.findUnique({ where: { email42: userInfo.email }, include: { friends: true, games: true, JoinedChatChannels: true } });
            }
            let { password, ...result } = dbUser;
            const payload = { sub: dbUser.id, username: dbUser.username };
            return { ...result, access_token: await this.jwtService.signAsync(payload) };
        }
        catch (err) {
            return (err);
        }
    }
    async get42UserInfo(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        };
        try {
            const response = await fetch('https://api.intra.42.fr/v2/me', requestOptions);
            const data = await response.json();
            return (data);
        }
        catch (err) {
            return (err);
        }
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService, users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map