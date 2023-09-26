import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatChannelsModule } from './chat-channels/chat-channels.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { AppGateway } from './app.gateway';



import { LobbyModule } from './game/lobby/lobby.module';
import { PlayerModule } from './game/player/player.module';
import { Instance } from './game/classes/instance.class';
import { ActionOnUserModule } from './action-on-user/action-on-user.module';

@Module({
  imports: [PrismaModule, UsersModule, ChatChannelsModule, ChatMessagesModule, AuthModule, FriendsModule, LobbyModule, PlayerModule, ActionOnUserModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
