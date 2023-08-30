import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Lobby } from '../classes/lobby.class';
import { LobbyMode, InputPacket } from '@shared/class';
import { Player } from '../player/player.class';
import { Server } from 'socket.io';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PlayerService } from '../player/player.service';

//@Injectable()
export class LobbyService {
	public constructor(private readonly playerService: PlayerService) {
	}


	/* Lobby Handling */
	private readonly logger = new Logger("LobbyService");
	private lobbies: Map<string, Lobby> = new Map<string, Lobby>();
	test: number = 3;

	findLobbyById(id: string) {
		this.lobbies.get(id);
	}
	sendToInstance<T extends InputPacket>(id:string, data: T, senderId: string) {
		const lobby = this.lobbies.get(id);
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
		return (true);
	}
	createLobby(mode: LobbyMode, server: Server, creator: Player) {
		try {
			const lobby = new Lobby(mode, server);
			if (!lobby)
				return ;
			this.logger.log(`Lobby ${lobby.id} created`);
			lobby.connectPlayer(creator);
			this.logger.log(`creator ${creator.id} joined ${lobby.id}`);
			this.lobbies.set(lobby.id, lobby);
			lobby.dispatchLobbyState();
		} catch (error) {
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
	removeLobbyById(id: string) {
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
	autoFindLobby(player: Player, mode: LobbyMode, server: Server):boolean {
		try {
			if (player.lobby != null)
				return false;
			let lobbyFinded: boolean = false;
			this.lobbies.forEach(lobby => {
				if ( lobby.nbPlayers < lobby.mode && mode == lobby.mode ) {
					this.logger.log(`player ${player.id} joined ${lobby.id}`);
					lobby.connectPlayer(player);
					lobbyFinded = true;
					lobby.dispatchLobbyState();
				}
			});
			if (!lobbyFinded) {
				this.createLobby(mode, server, player);
			}
			return true;
		} catch (error) {
			return error
		}
	}

	// TODO: Pour le moment on clear tout toues les 5 minutes, une fois le jeu codé il faudra
	// TODO... clear que les games terminé toutes les 5 minutes
	@Cron(CronExpression.EVERY_5_MINUTES,
		{name: 'lobby_cleaner'})
	clearLobbies() {
		this.lobbies.forEach((lobby: Lobby) => {
			if (lobby.instance.hasFinished) {
				lobby.clear();
				this.lobbies.delete(lobby.id);
			}
		})
		this.logger.log("Lobbies cleaned");
	}
}
