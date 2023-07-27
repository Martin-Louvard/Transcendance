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
    return this.prisma.user.findMany({include: {friends: true, games: true, JoinedChatChannels: true}});
  }

  findOne(username: string) {
    return this.prisma.user.findUnique({where: {username}, include: {friends: true, games: true, JoinedChatChannels: true}});
  }

  findById(id: number) {
    return this.prisma.user.findUnique({where: {id}, include: {friends: true, games: true, JoinedChatChannels: true}});
  }

  findBy42Email(email42: string) {
    return this.prisma.user.findUnique({where: {email42}, include: {friends: true, games: true, JoinedChatChannels: true}});
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, roundsOfHashing);
    }

    return this.prisma.user.update({where: {username}, data: updateUserDto});
  }

  async updateFriendList(username: string, updateUserFriendsDto: UpdateUserFriendsDto) {
    if (username == updateUserFriendsDto.friend_username)
      throw new NotAcceptableException(`You can't add yourself as a friend`);
    const userFriend = await this.prisma.user.findUnique({where: {username: updateUserFriendsDto.friend_username}});
    if (!userFriend)
      throw new NotFoundException(`No user found for username: ${username}`);

    await this.prisma.user.update({
      where: {username: username}, 
      data: {
        friends: {
          create: [{friend_id: userFriend.id}]
        }}
        });
    return this.prisma.user.findUnique({where: {username: username}, include: {friends: true}});
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
