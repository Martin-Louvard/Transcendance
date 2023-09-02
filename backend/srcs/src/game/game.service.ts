import { Injectable, Logger } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { UsersService } from 'src/users/users.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads, InputPacket } from '@shared/class';
import { Player } from './player/player.class';
import { PlayerService } from './player/player.service';
import { LobbyService } from './lobby/lobby.service';
import { Lobby } from './classes/lobby.class';

@Injectable()
export class GameService {
  constructor(private jwtService: JwtService, private lobbyService: LobbyService, private playerService: PlayerService) {
  }
	server: Server;
	private readonly logger = new Logger("GameService");


  afterInit(server: Server) {
    this.server = server;
  }

  handleDisconnect(client: Socket) {
    try {
		  this.playerService.disconnectPlayer(client);
    } catch (error) {
		return (error);
    }
  }

  async auth(client: Socket, data: ClientPayloads[ClientEvents.AuthState]): Promise<any> {
    try {
		this.jwtService.verify(data.token);
        this.playerService.connectPlayer({id: data.id, socket: client});
    } catch (error) {
		console.log("Cant identify socket due to :");
		return (error);
    }
  }

  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

  playerStart(socket: Socket): boolean {
    try {
      const player: Player = this.playerService.getPlayer(socket);
      if (!player) {
        console.log("socket not authenticated.")
        return false;
      }
      if (player.lobby == null) {
        console.log("Player not in lobby");
        return false;
      }
      if (!player.lobby.full) {
        console.log("Lobby Not full");
      }
      //const lobby =  this.lobbyService.getPlayerLobby(this.playerService.getPlayer(socket));
      player.setReady(true);
      return true;
    } catch (error) {
		return (error);
    }
  }

  // TODO: Ici ajouter un validator pour LobbyMode
  automatch(client: Socket, mode: LobbyMode) {
		try {
			const player: Player = this.playerService.getPlayer(client);
			if (!player || player.socket.id != client.id)
				return ;
			return this.lobbyService.autoFindLobby(player, mode, this.server);
		} catch (error) {
			return (error)
		}
  }

  leaveLobby(client: Socket) {
	try {
			
		const player: Player = this.playerService.getPlayer(client);
		if (!player || player.socket.id != client.id || !player.lobby )
			return ;
		this.lobbyService.leaveLobby(player);
		const payload: ServerPayloads[ServerEvents.AuthState] = {
			lobbyId: null,
			hasStarted: false,
		}
		player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
	} catch (error) {
		return (error)
	}
  }
  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
