import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TwoFactorAuthenticationController } from './twoFAauth.controller';
import { FriendsService } from 'src/friends/friends.service';
import { FriendsModule } from 'src/friends/friends.module';
import { ChatChannelsModule } from 'src/chat-channels/chat-channels.module';
import { ChatChannelsService } from 'src/chat-channels/chat-channels.service';


@Module({
  controllers: [UsersController, TwoFactorAuthenticationController],
  providers: [UsersService, FriendsService, ChatChannelsService],
  imports: [PrismaModule, FriendsModule, ChatChannelsModule],
  exports: [UsersService]
})
export class UsersModule {}
