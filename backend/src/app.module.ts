import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatChannelsModule } from './chat-channels/chat-channels.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [PrismaModule, UsersModule, ChatChannelsModule, ChatMessagesModule, AuthModule, FriendsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
