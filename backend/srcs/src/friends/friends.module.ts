import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatChannelsService } from 'src/chat-channels/chat-channels.service';
import { ChatChannelsModule } from 'src/chat-channels/chat-channels.module';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, ChatChannelsService],
  imports: [PrismaModule, ChatChannelsModule],
  exports: [FriendsService]
})
export class FriendsModule {}
