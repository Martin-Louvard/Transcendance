import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserFriendsDto } from './dto/update-user-friends.dto';
import { of } from 'rxjs';
import { join } from 'path';
import { authenticator } from 'otplib';
import * as bcrypt from 'bcrypt';
import { toDataURL } from 'qrcode';
import { FriendsService } from 'src/friends/friends.service';
import { ChatChannelsService } from 'src/chat-channels/chat-channels.service';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private friendsService: FriendsService,
    private chatChannelService : ChatChannelsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    createUserDto.password = hashedPassword;
    const userExists = await this.prisma.user.findUnique({ where: { username: createUserDto.username } });
    if (userExists)
      throw new NotAcceptableException("User already exists");
    
    const newUser = await this.prisma.user.create  ({ data: createUserDto });
    await this.chatChannelService.addUserToGeneralChat(newUser);
    return newUser;
    
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        friends: true,
        friendUserFriends: true,
        games: true,
        JoinedChatChannels: true,
        OwnedChatChannels: true,
        BannedFromChatChannels: true,
        AdminOnChatChannels: true,
      },
    });
  }

  async findAllFriends(id: number) {
    const friendships = await this.friendsService.findAllFriendships(id);
    const friendships_accepted = friendships.filter((friendship) => {
      return friendship.status === 'ACCEPTED';
    });
    const friends = friendships_accepted.map((f) => {
      return f.friend.id === id ? f.user : f.friend;
    });
    return friends;
  }

  async findOne(username: string) {
    const userRaw = await this.prisma.user.findUnique({ where: { username } });
    if (!userRaw)
      throw new NotFoundException(`No user found for username: ${username}`);
    userRaw.avatar =
      'http://localhost:3001/users/avatar/' +
      userRaw.username +
      '/' +
      userRaw.avatar.split('/').reverse()[0];
    const { password, twoFASecret, ...userWithoutSecrets } = userRaw;
    const user = { ...userWithoutSecrets };
    return user;
  }

  async findById(id: number) {
    const userRaw = await this.prisma.user.findUnique({
      where: { id },
      include: {
        games: true,
        JoinedChatChannels: {
          include: {
            owner: true,
            messages: {include: {sender: true}},
            friendship: true,
            participants: true,
            admins: true,
            bannedUsers: true,
          },
        },
        OwnedChatChannels: { include: { messages: true } },
        BannedFromChatChannels: { include: { messages: true } },
        AdminOnChatChannels: { include: { messages: true } },
      },
    });
    if (!userRaw) throw new NotFoundException(`No user found for id: ${id}`);

    const friendships = await this.friendsService.findAllFriendships(id);
    const friends = await this.findAllFriends(id);

    userRaw.avatar =
      'http://localhost:3001/users/avatar/' +
      userRaw.username +
      '/' +
      userRaw.avatar.split('/').reverse()[0];
    const { password, twoFASecret, ...userWithoutSecrets } = userRaw;
    const user = {
      ...userWithoutSecrets,
      friendships: friendships,
      friends: friends,
    };
    return user;
  }

  async getGames(id: number) {
    return (await this.prisma.game.findMany({
			where: {
			  players: {
				some: {
				  id: id,
				},
			  },
			},
      include:{visitor: true, home: true, players: true}
		  }));
  }

  async findBy42Email(email42: string) {
    const userRaw = await this.prisma.user.findUnique({ where: { email42 } });
    if (!userRaw)
      throw new NotFoundException(`No user found for email: ${email42}`);
    userRaw.avatar =
      'http://localhost:3001/users/avatar/' +
      userRaw.username +
      '/' +
      userRaw.avatar.split('/').reverse()[0];
    const { password, twoFASecret, ...userWithoutSecrets } = userRaw;
    const user = { ...userWithoutSecrets };
    return user;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    const user = await this.prisma.user.update({
      where: { username },
      data: updateUserDto,
    });
    return this.findOne(user.username);
  }

  async remove(id: number) {
    const userRaw = await this.prisma.user.findUnique({ where: { id } });
    if (!userRaw) throw new NotFoundException(`No user found for id: ${id}`);
    await this.prisma.user.update({
      where: { id },
      data: {
        friends: {
          deleteMany: {},
        },
        friendUserFriends: {
          deleteMany: {},
        },
      },
    });
    return this.prisma.user.delete({ where: { id } });
  }

  async addFriend(
    username: string,
    updateUserFriendsDto: UpdateUserFriendsDto,
  ) {
    if (username == updateUserFriendsDto.friend_username)
      throw new NotAcceptableException(`Self interaction prohibited`);

    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user)
      throw new NotFoundException(`No user found for username: ${username}`);

    const userFriend = await this.prisma.user.findUnique({
      where: { username: updateUserFriendsDto.friend_username },
      include: { friends: true, friendUserFriends: true },
    });
    if (!userFriend)
      throw new NotFoundException(
        `No user found for username: ${updateUserFriendsDto.friend_username}`,
      );

    await this.friendsService.create({
      user_id: user.id,
      friend_id: userFriend.id,
      sender_id: user.id,
      chat_id: 0,
    });

    return this.findOne(username);
  }

  async removeFriend(
    username: string,
    updateUserFriendsDto: UpdateUserFriendsDto,
  ) {
    if (username == updateUserFriendsDto.friend_username)
      throw new NotAcceptableException(`Self interaction prohibited`);

    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user)
      throw new NotFoundException(`No user found for username: ${username}`);

    const userFriend = await this.prisma.user.findUnique({
      where: { username: updateUserFriendsDto.friend_username },
    });
    if (!userFriend)
      throw new NotFoundException(
        `No user found for username: ${updateUserFriendsDto.friend_username}`,
      );

    const result = await this.prisma.friends.deleteMany({
      where: {
        OR: [
          {
            AND: [{ user_id: user.id }, { friend_id: userFriend.id }],
          },
          {
            AND: [{ user_id: userFriend.id }, { friend_id: user.id }],
          },
        ],
      },
    });
    if (result.count == 0)
      throw new NotFoundException(
        `No friendship found between: ${username} and ${updateUserFriendsDto.friend_username}`,
      );
    return this.findOne(username);
  }

  async updateAvatar(username: string, file) {
    await this.prisma.user.update({
      where: { username },
      data: {
        avatar: file.path,
      },
    });

    return this.findOne(username);
  }

  async findAvatar(username: string, res) {
    try {
      const user = await this.prisma.user.findUnique({ where: { username } });
      if (!user)
        throw new NotFoundException(`No user found for username: ${username}`);
      return of(res.sendFile(join(process.cwd(), user.avatar)));
    } catch (e)  {
      return (e);
    }
  }

  async setTwoFactorAuthenticationSecret(secret: string, username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user)
      throw new NotFoundException(`No user found for username: ${username}`);

    await this.prisma.user.update({
      where: { username },
      data: {
        twoFASecret: secret,
      },
    });
  }

  async generateTwoFactorAuthenticationSecret(username: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      username,
      'PONGED AUTHENTICATOR',
      secret,
    );

    await this.setTwoFactorAuthenticationSecret(secret, username);

    return {
      secret,
      otpauthUrl,
    };
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    username: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user)
      throw new NotFoundException(`No user found for username: ${username}`);

    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFASecret,
    });
  }

  async createOrLogin42(userInfo)
  {
    let dbUser;
    try{

      dbUser = await this.findBy42Email(userInfo.email)
    }
    catch(err){

        const usernametaken = await this.prisma.user.findUnique({where:{username: userInfo.login}});
        while (usernametaken && usernametaken.username == userInfo.login)
            userInfo.login = userInfo.login + Math.floor(Math.random() * (10000));
        dbUser = await this.prisma.user.create({data: {username: userInfo.login, email42: userInfo.email, email: userInfo.email}});
        await this.chatChannelService.addUserToGeneralChat(dbUser);
    }
    return dbUser;
  }
}
