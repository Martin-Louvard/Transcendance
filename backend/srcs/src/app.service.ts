import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UsersService } from './users/users.service';
import { PlayerService } from './game/player/player.service';

@Injectable()
export class AppService {
  constructor (private readonly jwtService:JwtService, private readonly usersService: UsersService,
    private readonly playerService: PlayerService) {}


  getHello(): string {
    return 'Hello World!';
  }
}
