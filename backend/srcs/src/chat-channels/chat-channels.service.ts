import { Injectable } from '@nestjs/common';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
export const roundsOfHashing = 10;

@Injectable()
export class ChatChannelsService {
  constructor(private prisma: PrismaService) {}

  create(createChatChannelDto: CreateChatChannelDto) {
    return this.prisma.chatChannel.create({ data: createChatChannelDto });
  }

  findAll() {
    return this.prisma.chatChannel.findMany({
      include: {
        owner: true,
        participants: true,
        bannedUsers: true,
        admins: true,
        messages: true,
      },
    });
  }

  async checkPassword(id: number, password: string) {
    const chat = await this.prisma.chatChannel.findUnique({ where: { id } });
    const chatPassword = chat.password.toString();
    const isPasswordValid = await bcrypt.compare(password, chatPassword);

    if (!isPasswordValid) return false;
    return true;
  }

  findOne(id: number) {
    return this.prisma.chatChannel.findUnique({
      where: { id },
      include: {
        messages: true,
        participants: true,
        owner: true,
        admins: true,
        bannedUsers: true,
      },
    });
  }

  update(id: number, updateChatChannelDto: UpdateChatChannelDto) {
    return this.prisma.chatChannel.update({
      where: { id },
      data: updateChatChannelDto,
    });
  }

  remove(id: number) {
    return this.prisma.chatChannel.delete({ where: { id }, 
      include: {
        messages: true,
        participants: true,
      },
    });
  }

  async addUserToGeneralChat(user)
  {
    const chatGeneral = await this.prisma.chatChannel.findFirst({
      where: { name: 'WorldChannel' },
    });
    const chatGeneralId = chatGeneral.id;

    await this.prisma.chatChannel.update({
      where: { id: chatGeneralId },
      data: {
        participants: {
          connect: [{ id: user.id }],
        },
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        JoinedChatChannels: { connect: [{ id: chatGeneralId }] },
      },
    });

  }
}
