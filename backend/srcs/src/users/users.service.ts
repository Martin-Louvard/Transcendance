import { Injectable, NotFoundException, NotAcceptableException, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserFriendsDto } from './dto/update-user-friends.dto';
import { of } from 'rxjs';
import { join } from 'path';
import { authenticator } from 'otplib';
import * as bcrypt from 'bcrypt';
import { toDataURL } from 'qrcode';

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
    return this.prisma.user.findMany({include: {friends: true, friendUserFriends: true, games: true, JoinedChatChannels: true,   OwnedChatChannels: true,
      BannedFromChatChannels: true,
      AdminOnChatChannels: true}});
  }

  async findOne(username: string) {
    const userRaw = await this.prisma.user.findUnique({where: {username}, include: {games: true, JoinedChatChannels: true,   OwnedChatChannels: true,
      BannedFromChatChannels: true,
      AdminOnChatChannels: true,
    }});
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
    userRaw.avatar = "http://localhost:3001/users/avatar/" + userRaw.username
    const {password, twoFASecret, ...userWithoutSecrets} = userRaw;
    const user = { ...userWithoutSecrets, friends: friends };
    return user
  }

  async findById(id: number) {
    const userRaw = await this.prisma.user.findUnique({where: {id}, include: {games: true, JoinedChatChannels: true,   OwnedChatChannels: true,
      BannedFromChatChannels: true,
      AdminOnChatChannels: true}});
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
    userRaw.avatar = "http://localhost:3001/users/avatar/" + userRaw.username
    const user = { ...userRaw, friends: friends };
    return user
  }

  async findBy42Email(email42: string) {
    const userRaw = await this.prisma.user.findUnique({where: {email42}, include: {games: true, JoinedChatChannels: true,  OwnedChatChannels: true,
      BannedFromChatChannels: true,
      AdminOnChatChannels: true}});
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
    userRaw.avatar = "http://localhost:3001/users/avatar/" + userRaw.username
    const user = { ...userRaw, friends: friends };
    return user
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, roundsOfHashing);
    }

    await this.prisma.user.update({where: {username}, data: updateUserDto});
    return this.findOne(username)
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

  async updateAvatar(username: string, file){
    await this.prisma.user.update({where: {username}, 
      data: {
        avatar: file.path
    }});

    return this.findOne(username)
  }

  async findAvatar(username:string, res){
    const user = await this.prisma.user.findUnique({where: {username}});
    if (!user)
      throw new NotFoundException(`No user found for username: ${username}`);
    return of(res.sendFile(join(process.cwd(), user.avatar)))

  }

  async setTwoFactorAuthenticationSecret(secret: string, username: string) {
    const user = await this.prisma.user.findUnique({where: {username}})
    if (!user)
      throw new NotFoundException(`No user found for username: ${username}`);
    
    await this.prisma.user.update({where: {username},
      data: {
        twoFASecret: secret
    }});
  }

  async generateTwoFactorAuthenticationSecret(username: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(username, 'PONGED AUTHENTICATOR', secret);

    await this.setTwoFactorAuthenticationSecret(secret, username);

    return {
      secret,
      otpauthUrl
    }
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, username: string) {
    const user = await this.prisma.user.findUnique({where: {username}})
    if (!user)
      throw new NotFoundException(`No user found for username: ${username}`);
      
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFASecret,
    });
  }
}
