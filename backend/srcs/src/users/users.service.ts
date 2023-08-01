import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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
    return this.prisma.user.findMany({include: {
      friends: true,
      games: true,
      JoinedChatChannels: true,
      OwnedChatChannels: true,
      BannedFromChatChannels: true,
      AdminOnChatChannels: true
    }});
  }

  findOne(username: string) {
    return this.prisma.user.findUnique({where: {username}, include: {
      friends: true,
      games: true,
      JoinedChatChannels: true,
      OwnedChatChannels: true,
      BannedFromChatChannels: true,
      AdminOnChatChannels: true
    }});
  }

  findById(id: number) {
    return this.prisma.user.findUnique({where: {id}, include: {
      friends: true,
      games: true,
      JoinedChatChannels: true,
      OwnedChatChannels: true,
      BannedFromChatChannels: true,
      AdminOnChatChannels: true
    }});
  }

  findBy42Email(email42: string) {
    return this.prisma.user.findUnique({where: {email42}, include: {
      friends: true,
      games: true,
      JoinedChatChannels: true,
      OwnedChatChannels: true,
      BannedFromChatChannels: true,
      AdminOnChatChannels: true
    }});
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, roundsOfHashing);
    }

    return this.prisma.user.update({where: {username}, data: updateUserDto});
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
