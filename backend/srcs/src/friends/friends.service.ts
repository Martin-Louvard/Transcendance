import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatChannelsService } from 'src/chat-channels/chat-channels.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService, private chatChannelsService: ChatChannelsService) {}

  async create(createFriendDto: CreateFriendDto) {
    const friendshipExists = await this.friendshipExists(createFriendDto.user_id, createFriendDto.friend_id)
    if(friendshipExists)
      throw new NotAcceptableException("Friendship already exists!");

    const chat =  await this.chatChannelsService.create({ownerId: createFriendDto.user_id, participants:{connect:[{id: createFriendDto.user_id}, {id: createFriendDto.friend_id}]}})
    createFriendDto.chat_id = chat.id
    const friendship = await this.prisma.friends.create({data: createFriendDto})
    return friendship
  }

  findAll() {
    return this.prisma.friends.findMany();
  }

  async findOne(id: number) {
    const unParsedFriendship = await this.prisma.friends.findUnique({
      where: {id},
      include:{
        user: true,
        friend: true
      }
    });
    const {user, friend, ...friendship} = unParsedFriendship;
    user.avatar =  "http://localhost:3001/users/avatar/" + user.username + "/" + user.avatar.split("/").reverse()[0]
    friend.avatar =  "http://localhost:3001/users/avatar/" + friend.username + "/" + friend.avatar.split("/").reverse()[0]
    const { password: userPassword, twoFASecret: userTwoFASecret, ...parsedUser } = user;
    const { password: friendPassword, twoFASecret: friendTwoFASecret, ...parsedFriend } = friend;

    return {...friendship, friend: parsedFriend, user: parsedUser };
  }

  async findWithFriend(id:number, userToIncludeId: number) {
    const unParsedFriendship = await this.findOne(id);
    const {user, friend, ...friendship} = unParsedFriendship;
    const userToIncludeInFriendship = user.id === userToIncludeId ? user : friend;
    return { ...friendship, friend: userToIncludeInFriendship };
  }

  async findAllFriendships(id: number) {
    const friendships = await this.prisma.friends.findMany({
      where: { 
        OR : [
              {user_id: id},
              {friend_id: id}
            ]
          },
        include:{
          user:true,
          friend: true
        }})
    return friendships.map(oldFriendship => {
      const {user, friend, ...friendship} = oldFriendship;
      user.avatar = "http://localhost:3001/users/avatar/" + user.username + "/" + user.avatar.split("/").reverse()[0]
      friend.avatar = "http://localhost:3001/users/avatar/" + friend.username + "/" + friend.avatar.split("/").reverse()[0]
      const { password: friendPassword, twoFASecret: friendTwoFASecret, ...parsedFriend } = friend;
      const { password: userPassword, twoFASecret: userTwoFASecret, ...parsedUser } = user;
      return { ...friendship, friend: parsedFriend, user: parsedUser };
    });
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

  async friendshipExists(user_id: number, friend_id:number){
    const result = await this.prisma.friends.findFirst({
      where: { 
        OR : [
          {
            AND:[
              { user_id: user_id},
              { friend_id: friend_id }
            ]
          },
          {
            AND:[
              { user_id: friend_id},
              { friend_id:user_id }
            ]
          }
        ]

      },
    })
    if (result != null)
      return true;
    return false
  }
}
