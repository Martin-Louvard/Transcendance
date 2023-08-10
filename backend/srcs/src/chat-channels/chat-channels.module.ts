import { Module } from '@nestjs/common';
import { ChatChannelsService } from './chat-channels.service';
import { ChatChannelsController } from './chat-channels.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatChannelsGateway } from './chat-channels.gateway';
import { ChatMessagesService } from 'src/chat-messages/chat-messages.service';

@Module({
  controllers: [ChatChannelsController],
  providers: [ChatChannelsService, ChatChannelsGateway, ChatMessagesService],
  imports: [PrismaModule ],
  exports: [ChatChannelsService]
})
export class ChatChannelsModule {}
