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
exports.UsersService = exports.roundsOfHashing = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
exports.roundsOfHashing = 10;
let UsersService = exports.UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, exports.roundsOfHashing);
        createUserDto.password = hashedPassword;
        return this.prisma.user.create({ data: createUserDto });
    }
    findAll() {
        return this.prisma.user.findMany({
            include: {
                friends: true,
                games: true,
                JoinedChatChannels: true,
                OwnedChatChannels: true,
                BannedFromChatChannels: true,
                AdminOnChatChannels: true,
            },
        });
    }
    async findOne(username) {
        const userRaw = await this.prisma.user.findUnique({
            where: { username },
            include: { games: true, JoinedChatChannels: true },
        });
        if (!userRaw)
            throw new common_1.NotFoundException(`No user found for username: ${username}`);
        const friends = await this.prisma.friends.findMany({
            where: {
                OR: [{ user_id: userRaw.id }, { friend_id: userRaw.id }],
            },
        });
        const user = { ...userRaw, friends: friends };
        return user;
    }
    async findById(id) {
        const userRaw = await this.prisma.user.findUnique({
            where: { id },
            include: {
                friends: true,
                games: true,
                JoinedChatChannels: true,
                OwnedChatChannels: true,
                BannedFromChatChannels: true,
                AdminOnChatChannels: true,
            },
        });
        if (!userRaw)
            throw new common_1.NotFoundException(`No user found for id: ${id}`);
        const friends = await this.prisma.friends.findMany({
            where: {
                OR: [{ user_id: id }, { friend_id: id }],
            },
        });
        const user = { ...userRaw, friends: friends };
        return user;
    }
    async findBy42Email(email42) {
        const userRaw = await this.prisma.user.findUnique({
            where: { email42 },
            include: {
                friends: true,
                games: true,
                JoinedChatChannels: true,
                OwnedChatChannels: true,
                BannedFromChatChannels: true,
                AdminOnChatChannels: true,
            },
        });
        if (!userRaw)
            throw new common_1.NotFoundException(`No user found for email: ${email42}`);
        const friends = await this.prisma.friends.findMany({
            where: {
                OR: [{ user_id: userRaw.id }, { friend_id: userRaw.id }],
            },
        });
        const user = { ...userRaw, friends: friends };
        return user;
    }
    async update(username, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, exports.roundsOfHashing);
        }
        return this.prisma.user.update({
            where: { username },
            data: updateUserDto,
        });
    }
    async remove(id) {
        const userRaw = await this.prisma.user.findUnique({ where: { id } });
        if (!userRaw)
            throw new common_1.NotFoundException(`No user found for id: ${id}`);
        await this.prisma.user.update({
            where: { id },
            data: {
                friends: {
                    deleteMany: {},
                },
                friendUserFriends: {
                    deleteMany: {},
                },
            },
        });
        return this.prisma.user.delete({ where: { id } });
    }
    async addFriend(username, updateUserFriendsDto) {
        if (username == updateUserFriendsDto.friend_username)
            throw new common_1.NotAcceptableException(`Self interaction prohibited`);
        const userFriend = await this.prisma.user.findUnique({
            where: { username: updateUserFriendsDto.friend_username },
            include: { friends: true, friendUserFriends: true },
        });
        if (!userFriend)
            throw new common_1.NotFoundException(`No user found for username: ${username}`);
        await this.prisma.user.update({
            where: { username: username },
            data: {
                friends: {
                    create: [{ friend_id: userFriend.id }],
                },
            },
        });
        return this.findOne(username);
    }
    async removeFriend(username, updateUserFriendsDto) {
        if (username == updateUserFriendsDto.friend_username)
            throw new common_1.NotAcceptableException(`Self interaction prohibited`);
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (!user)
            throw new common_1.NotFoundException(`No user found for username: ${username}`);
        const userFriend = await this.prisma.user.findUnique({
            where: { username: updateUserFriendsDto.friend_username },
        });
        if (!userFriend)
            throw new common_1.NotFoundException(`No user found for username: ${updateUserFriendsDto.friend_username}`);
        const result = await this.prisma.friends.deleteMany({
            where: {
                OR: [
                    {
                        AND: [{ user_id: user.id }, { friend_id: userFriend.id }],
                    },
                    {
                        AND: [{ user_id: userFriend.id }, { friend_id: user.id }],
                    },
                ],
            },
        });
        if (result.count == 0)
            throw new common_1.NotFoundException(`No friendship found between: ${username} and ${updateUserFriendsDto.friend_username}`);
        return this.findOne(username);
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map