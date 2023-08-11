import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Lobby } from './lobby.class';
import { LobbyMode } from '../../Types';
import { Player } from '../player/player.class';
import { Server } from 'socket.io';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

//@Injectable()
export class LobbyService {
	public constructor() {
	}


	/* Lobby Handling */
	private readonly logger = new Logger("LobbyService");
	private lobbies: Array<Lobby> = new Array<Lobby>();
	test: number = 3;

	addLobby(lobby: Lobby) {
		if (lobby)
			this.lobbies.push(lobby);
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
		this.logger.log(this.lobbies.length);
		try {
			const lobby = new Lobby(mode, server);
			if (!lobby)
				return ;
			this.logger.log(`Lobby ${lobby.id} created`);
			lobby.connectPlayer(creator);
			this.logger.log(`creator ${creator.id} joined ${lobby.id}`);
			this.lobbies.push(lobby);
			lobby.dispatchLobbyState();
		} catch (error) {
			console.log(error);
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
	removeLobby(lobby: Lobby) {
		try {
			const index = this.lobbies.indexOf(lobby);
			if (index > -1) {
				this.lobbies[index].players.forEach((player) => {
					this.leaveLobby(player);
				})
				this.lobbies.splice(index, 1);
				this.logger.log(`lobby ${lobby.id} removed`);
			}
		} catch (error) {
			console.log(error);
		}
	}
	autoFindLobby(player: Player, mode: LobbyMode, server: Server):boolean {
		try {
			if (player.lobby != null)
				return false;
			let lobbyFinded: boolean = false;
			this.lobbies.forEach(lobby => {
				if ( lobby.nbPlayers < (lobby.mode == LobbyMode.duel ? 2 : 4) && mode == lobby.mode ) {
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
			console.log(error);
		}
	}

	// TODO: Pour le moment on clear tout toues les 1 minutes, une fois le jeu codé il faudra
	// TODO... clear que les games terminé toutes les 5 minutes
	@Cron(CronExpression.EVERY_5_MINUTES,
		{name: 'lobby_cleaner'})
	clearLobbies() {
		this.lobbies.forEach((lobby: Lobby) => {
			this.logger.log(`${lobby.id} cleared`);
			lobby.clear();
			this.lobbies.pop();
		})
		this.logger.log("Lobbies cleaned");
	}
}
