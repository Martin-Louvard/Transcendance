import { Injectable } from '@nestjs/common';
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
    return this.prisma.chatChannel.create({
      data: {
        ownerId: user.id,
      },
    });
  }

  findAll() {
    return this.prisma.chatChannel.findMany({});
  }

  findOne(id: number) {
    return this.prisma.chatChannel.findUnique({ where: { id } });
  }

  async update(id: number, updateChatChannelDto: UpdateChatChannelDto) {
    const channel = await this.prisma.chatChannel.findUnique({ where: { id } });
    return this.prisma.chatChannel.update({
      where: { id: channel.id },
      data: channel,
    });
  }

  remove(id: number) {
    return this.prisma.chatChannel.delete({ where: { id } });
  }
}
