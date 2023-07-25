import { Module } from '@nestjs/common';
import { ChatChannelsService } from './chat-channels.service';
import { ChatChannelsController } from './chat-channels.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ChatChannelsController],
  providers: [ChatChannelsService],
  imports: [PrismaModule]
})
export class ChatChannelsModule {}
