import { Injectable } from '@nestjs/common';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatMessagesService {
  constructor(private prisma: PrismaService) {}

  create(createChatMessageDto: CreateChatMessageDto) {
    return this.prisma.chatMessage.create({ data: createChatMessageDto });
  }

  findAll() {
    return this.prisma.chatMessage.findMany();
  }

  findOne(id: number) {
    return this.prisma.chatMessage.findUnique({ where: { id } });
  }

  update(id: number, updateChatMessageDto: UpdateChatMessageDto) {
    return this.prisma.chatMessage.update({
      where: { id },
      data: updateChatMessageDto,
    });
  }

  remove(id: number) {
    return this.prisma.chatMessage.delete({ where: { id } });
  }
}
