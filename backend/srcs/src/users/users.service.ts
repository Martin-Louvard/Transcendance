import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserFriendsDto } from './dto/update-user-friends.dto';

import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash( createUserDto.password, roundsOfHashing);
    createUserDto.password = hashedPassword;

    return this.prisma.user.create({data: createUserDto});
  }

  findAll() {
    return this.prisma.user.findMany({include: {friends: true, friendUserFriends: true, games: true, JoinedChatChannels: true}});
  }

  async findOne(username: string) {
    const userRaw = await this.prisma.user.findUnique({where: {username}, include: {games: true, JoinedChatChannels: true}});
    if (!userRaw)
      throw new NotFoundException(`No user found for username: ${username}`);
    const friends = await this.prisma.friends.findMany({
      where: { 
        OR:[
          { user_id: userRaw.id},
          { friend_id: userRaw.id }
        ]
      },
    });
    const user = { ...userRaw, friends: friends };
    return user
  }

  async findById(id: number) {
    const userRaw = await this.prisma.user.findUnique({where: {id}, include: {games: true, JoinedChatChannels: true}});
    if (!userRaw)
      throw new NotFoundException(`No user found for id: ${id}`);
      
    const friends = await this.prisma.friends.findMany({
      where: { 
        OR:[
          { user_id: id},
          { friend_id: id }
        ]
      },
    });
    const user = { ...userRaw, friends: friends };
    return user
  }

  async findBy42Email(email42: string) {
    const userRaw = await this.prisma.user.findUnique({where: {email42}, include: {games: true, JoinedChatChannels: true}});
    if (!userRaw)
      throw new NotFoundException(`No user found for email: ${email42}`);

    const friends = await this.prisma.friends.findMany({
      where: { 
        OR:[
          { user_id: userRaw.id},
          { friend_id: userRaw.id }
        ]
      },
    });
    const user = { ...userRaw, friends: friends };
    return user
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, roundsOfHashing);
    }
    return this.prisma.user.update({where: {username}, data: updateUserDto});
  }

  async remove(id: number) {
    const userRaw = await this.prisma.user.findUnique({where: {id}});
    if (!userRaw)
      throw new NotFoundException(`No user found for id: ${id}`);
    await  this.prisma.user.update({ 
        where: {id},
        data:{
          friends: {
            deleteMany: {}
          },
          friendUserFriends: {
            deleteMany: {}
          }
        }
      })
      return this.prisma.user.delete({ where: { id }});
  }

  async addFriend(username: string, updateUserFriendsDto: UpdateUserFriendsDto) {
    if (username == updateUserFriendsDto.friend_username)
      throw new NotAcceptableException(`Self interaction prohibited`);
  
    const userFriend = await this.prisma.user.findUnique({where: {username: updateUserFriendsDto.friend_username}, include: {friends: true, friendUserFriends: true}});
    if (!userFriend)
      throw new NotFoundException(`No user found for username: ${username}`);

    
    await this.prisma.user.update({
        where: {username: username}, 
        data: {
          friends: {
            create: [{friend_id: userFriend.id}]
          }}
      });
    
    return this.findOne(username)
  }

  async removeFriend(username: string, updateUserFriendsDto: UpdateUserFriendsDto){
    if (username == updateUserFriendsDto.friend_username)
      throw new NotAcceptableException(`Self interaction prohibited`);
    
    const user = await this.prisma.user.findUnique({where: {username}});
    if (!user)
      throw new NotFoundException(`No user found for username: ${username}`);
    
      const userFriend = await this.prisma.user.findUnique({where: {username: updateUserFriendsDto.friend_username}})
    if (!userFriend)
      throw new NotFoundException(`No user found for username: ${updateUserFriendsDto.friend_username}`);
    
    const result = await this.prisma.friends.deleteMany({
      where: { 
        OR : [
          {
            AND:[
              { user_id: user.id},
              { friend_id: userFriend.id }
            ]
          },
          {
            AND:[
              { user_id: userFriend.id},
              { friend_id: user.id }
            ]
          }
        ]

      },
    })
    if(result.count == 0)
      throw new NotFoundException(`No friendship found between: ${username} and ${updateUserFriendsDto.friend_username}`);

    return this.findOne(username);
  }

}
