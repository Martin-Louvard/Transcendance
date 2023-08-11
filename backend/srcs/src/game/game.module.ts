import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { LobbyModule } from './lobby/lobby.module';
import { GameService } from './game.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LobbyService } from './lobby/lobby.service';
import { PlayerService } from './player/player.service';

@Module({
  imports: [JwtModule, LobbyModule, PlayerModule],
  providers: [GameService, JwtService, LobbyService, PlayerService],
  exports: [GameService]
})
export class GameModule {}
