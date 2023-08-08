import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(createChatChannelDto: CreateChatChannelDto) {
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

  async findOne(id: number) {
    const channelRaw = await this.prisma.chatChannel.findUnique({
      where: { id },
      include: {
        participants: true,
        bannedUsers: true,
      },
    });
    if (!channelRaw)
      throw new NotFoundException(`No Channel found for id: ${id}`);
    return channelRaw;
  }

  async update(id: number, updateChatChannelDto: UpdateChatChannelDto) {
    const channel = await this.prisma.chatChannel.findUnique({ where: { id } });
    await this.prisma.chatChannel.update({
      where: { id: channel.id },
      data: updateChatChannelDto,
    });
    return this.prisma.chatChannel.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.chatChannel.delete({ where: { id } });
  }
}
