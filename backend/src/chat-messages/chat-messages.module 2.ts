import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesController } from './chat-messages.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService],
  imports: [PrismaModule]
})
export class ChatMessagesModule {}
