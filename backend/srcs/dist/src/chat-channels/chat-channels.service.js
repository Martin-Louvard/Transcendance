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
exports.ChatChannelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatChannelsService = exports.ChatChannelsService = class ChatChannelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createChatChannelDto) {
        const user = await this.prisma.user.findUnique({
            where: { username: createChatChannelDto.owner_username },
        });
        createChatChannelDto.ownerId = user.id;
        return this.prisma.chatChannel.create({
            data: {
                ownerId: user.id,
            },
        });
    }
    async findAll() {
        const chatChannels = await this.prisma.chatChannel.findMany({
            include: { participants: true },
        });
        return chatChannels;
    }
    async findOne(id) {
        const channelRaw = await this.prisma.chatChannel.findUnique({
            where: { id },
            include: {
                participants: true,
                bannedUsers: true,
            },
        });
        if (!channelRaw)
            throw new common_1.NotFoundException(`No Channel found for id: ${id}`);
        return channelRaw;
    }
    async update(id, updateChatChannelDto) {
        const channel = await this.prisma.chatChannel.findUnique({ where: { id } });
        await this.prisma.chatChannel.update({
            where: { id: channel.id },
            data: updateChatChannelDto,
        });
        return this.prisma.chatChannel.findUnique({ where: { id } });
    }
    remove(id) {
        return this.prisma.chatChannel.delete({ where: { id } });
    }
};
exports.ChatChannelsService = ChatChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatChannelsService);
//# sourceMappingURL=chat-channels.service.js.map