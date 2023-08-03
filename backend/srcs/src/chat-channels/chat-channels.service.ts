import { Injectable } from '@nestjs/common';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatChannelsService {
  constructor(private prisma: PrismaService) {}

  create(createChatChannelDto: CreateChatChannelDto) {
    return this.prisma.chatChannel.create({data: createChatChannelDto});
  }

  findAll() {

    return this.prisma.chatChannel.findMany({include: {
      participants: true,
      bannedUsers: true,
      admins: true,
      messages: true 
    }});
  }

  findOne(id: number) {
    return this.prisma.chatChannel.findUnique({where: {id}});
  }

  update(id: number, updateChatChannelDto: UpdateChatChannelDto) {
    return this.prisma.chatChannel.update({where: {id}, data: updateChatChannelDto});
  }

  remove(id: number) {
    return this.prisma.chatChannel.delete({ where: { id } });
  }
}
