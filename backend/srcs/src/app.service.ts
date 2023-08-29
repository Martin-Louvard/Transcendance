import { Injectable } from '@nestjs/common';
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

  async auth(client: Socket): Promise<void> {
    try {
      console.log("auth socket token : " + client.handshake.auth.token);
      if (!client.handshake.auth.token || client.handshake.auth.token == "abc") {
        throw "no jwt token"
      }
      const payload = this.jwtService.verify(
        client.handshake.auth.token,
      );
        const user = await this.usersService.findById(payload.sub);
        if (!user) 
          throw "user not registered";
        this.playerService.connectPlayer({id: payload.sub, socket: client});

    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }
}
