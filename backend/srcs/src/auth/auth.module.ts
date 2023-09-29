import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { PlayerService } from '../game/player/player.service';
import { AppGateway } from 'src/app.gateway';
import { LobbyService } from 'src/game/lobby/lobby.service';
import { PlayerModule } from 'src/game/player/player.module';
import { FriendsModule } from 'src/friends/friends.module';


@Module({
  imports: [UsersModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    PlayerModule,
    FriendsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PlayerService, AppGateway, LobbyService ],
  exports: [AuthService],
})
export class AuthModule {}
