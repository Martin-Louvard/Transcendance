import { Module } from '@nestjs/common';
import { ChatChannelsService } from './chat-channels.service';
import { ChatChannelsController } from './chat-channels.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatChannelsGateway } from './chat-channels.gateway';

@Module({
  controllers: [ChatChannelsController],
  providers: [ChatChannelsService, ChatChannelsGateway],
  imports: [PrismaModule]
})
export class ChatChannelsModule {}
