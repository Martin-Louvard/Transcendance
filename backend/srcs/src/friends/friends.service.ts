import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatChannelsService } from 'src/chat-channels/chat-channels.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService, private chatChannelsService: ChatChannelsService) {}

  async create(createFriendDto: CreateFriendDto) {
    const chat =  await this.chatChannelsService.create({ownerId: createFriendDto.user_id, participants:{connect:[{id: createFriendDto.user_id}, {id: createFriendDto.friend_id}]}})
    createFriendDto.chat_id = chat.id
    const friendship = await this.prisma.friends.create({data: createFriendDto})
    return friendship
  }

  findAll() {
    return `This action returns all friends`;
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  async remove(id: number) {
    await this.prisma.friends.update({ 
      where: {id},
      data:{
        chat: {
          delete: {}
        }
      }
    })
    return this.prisma.friends.delete({ where: { id }});
  }
}
