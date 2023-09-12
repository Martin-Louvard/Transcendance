import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Lobby } from './lobby.class';
import { LobbyMode, InputPacket, GameParameters, PlayerInfo, ServerEvents, ServerPayloads, GameInvitation, ClientPayloads, ClientEvents, LobbyCli } from '@shared/class';
import { Player } from '../player/player.class';
import { Server } from 'socket.io';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PlayerService } from '../player/player.service';
import { v4 } from 'uuid';

@Injectable()
export class LobbyService {
	public constructor(private readonly playerService: PlayerService) {
	}
	gameRequest: GameInvitation[];
	private readonly logger = new Logger("LobbyService");
	private lobbies: Map<string, Lobby> = new Map<string, Lobby>();
	test: number = 3;
	server: Server;


	setServer(server: Server) {
		this.server = server;
	}
	findLobbyById(id: string): Lobby {
		return (this.lobbies.get(id));
	}
	sendToInstance<T extends InputPacket>(id:string, data: T, senderId: string) {
		const lobby = this.lobbies.get(id);
		if (!lobby || !lobby.instance) {
			// TODO: throw an error
			return ;
		}
		lobby.instance.processGameData<T>(data);
	}
	addLobby(lobby: Lobby) {
		if (lobby)
			this.lobbies.set(lobby.id, lobby);
	}
	leaveLobby(player: Player) {
		if (!player.lobby)
			return false;
		const lobby = player.lobby;
		lobby.removePlayer(player);
		this.logger.log(`${player.id} leave lobby ${lobby.id}`);
		if (lobby.nbPlayers == 0)
			this.removeLobby(lobby);
		else
			lobby.dispatchLobbyState();
		const payload: ServerPayloads[ServerEvents.AuthState] = {
			lobbyId: null,
			hasStarted: false,
			owner: null,
		}
		player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
		return (true);
	}
	createLobby(mode: LobbyMode, server: Server, creator: Player) {
		try {
			const lobby = new Lobby(mode, server, creator);
			if (!lobby)
				return ;
			this.logger.log(`Lobby ${lobby.id} created`);
			lobby.connectPlayer(creator);
			this.logger.log(`creator ${creator.id} joined ${lobby.id}`);
			this.lobbies.set(lobby.id, lobby);
			lobby.dispatchLobbyState();
		} catch (error) {
			console.log(error);
			return error
		}
	}
	
	getJoinableLobbies() {
		let lobbies:LobbyCli[] = [];
		this.lobbies.forEach((e) => {
			if (e.instance && !e.instance.hasStarted && !e.instance.automatch && e.isOnlineSlot())
				lobbies.push({id: e.id, slots: e.slots, creator: e.owner.infos});
		})
		return (lobbies);
	}

	createLobbyByParameters(params: GameParameters, server: Server, creator: Player) {
		try {
			if (params.classic) {
				// TODO: create classic lobby
				return ;
			} else if (params.duel) {
				const lobby = Lobby.fromGameParameter(params, server, creator);
				if (!lobby)
					return ;
				this.logger.log(`Lobby ${lobby.id} created`);
				lobby.connectPlayer(creator);
				this.logger.log(`creator ${creator.id} joined ${lobby.id}`);
				this.lobbies.set(lobby.id, lobby);
				lobby.dispatchLobbyState();
			} else {
				const lobby = Lobby.fromGameParameter(params, server, creator);
				if (!lobby)
					return ;
				this.logger.log(`Lobby ${lobby.id} created`);
				lobby.connectPlayer(creator);
				this.logger.log(`creator ${creator.id} joined ${lobby.id}`);
				this.lobbies.set(lobby.id, lobby);
				lobby.dispatchLobbyState();
			}
		} catch (error) {
			console.log(error);
			return error
		}
	}
	getPlayerLobby(player: Player): Lobby | null {
		this.lobbies.forEach(lobby => {
			lobby.players.forEach(e => {
				if (e.id == player.id)
					return (lobby);
			});
		});
		return (null)
	}
	removeLobbyById(id: string) {
		this.lobbies.delete(id);
	}
	removeLobby(lobby: Lobby) {
		try {
			this.lobbies.delete(lobby.id)
			this.logger.log(`lobby ${lobby.id} removed`);
		} catch (error) {
			return error
		}
	}

	joinLobby(player: Player, data: {lobbyId: string, info: PlayerInfo}) {
		player.infos = data.info;
		const lobby = this.findLobbyById(data.lobbyId);
		if (!lobby)
			return 'lobby not found';
		return (lobby.connectPlayer(player))
	}

	automatch(player: Player, data: {mode: LobbyMode, info: PlayerInfo}, server: Server):boolean {
		try {
			if (!player || player.lobby)
				return ;
			player.infos = data.info;
			let lobbyFinded: boolean = false;
			this.lobbies.forEach(lobby => {
				if (data.mode == lobby.mode && lobby.instance && !lobby.instance.hasStarted && lobby.instance.automatch) {
					this.logger.log(`player ${player.id} joined ${lobby.id}`);
					lobby.connectPlayer(player);
					lobbyFinded = true;
					lobby.dispatchLobbyState();
				}
			});
			if (!lobbyFinded) {
				this.createLobby(data.mode, server, player);
			}
			return true;
		} catch (error) {
			return error
		}
	}

	invitePlayer(player: Player, data: ClientPayloads[ClientEvents.GameSendRequest]): boolean {
		if (!player || !player.isOnline)
		  return false
		const sender = this.playerService.getPlayerById(data.senderId);
		if (!sender || !sender.isOnline || !sender.lobby || !sender.infos)
		return false
		const payload: ServerPayloads[ServerEvents.GameInvitation] = {
		  sender: sender.infos,
		  receiver: player.infos,
		  lobby: {
			id: sender.lobby.id,
			mode: sender.lobby.mode,
		  },
		  id: v4(),
		  timestamp: Date.now(),
		}
		player.emit<ServerPayloads[ServerEvents.GameInvitation]>(ServerEvents.GameInvitation, payload);
		sender.emit<GameInvitation>(ServerEvents.SuccessfulInvited, payload);
	  }

	// TODO: Pour le moment on clear tout toues les 5 minutes, une fois le jeu codé il faudra
	// TODO... clear que les games terminé toutes les 5 minutes
	@Cron(CronExpression.EVERY_5_MINUTES,
		{name: 'lobby_cleaner'})
	clearLobbies() {
		//this.lobbies.forEach((lobby: Lobby) => {
		//	if (lobby.instance.hasFinished) {
		//		lobby.clear();
		//		this.lobbies.delete(lobby.id);
		//	}
		//})
		//this.logger.log("Lobbies cleaned");
	}
}
