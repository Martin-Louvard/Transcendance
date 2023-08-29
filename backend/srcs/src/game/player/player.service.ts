import { Socket } from "socket.io";
import { Player } from "./player.class";
import { Injectable, Logger } from '@nestjs/common';
import { ServerEvents, ServerPayloads } from "@shared/class";

@Injectable()
export class PlayerService {
	constructor() {
	}
	private readonly logger = new Logger("PlayerService");
	/* Player Handling */
	players: Map<string, Player> = new Map<string, Player>();

	getLobby(socketId: string) {
		const player = this.players.get(socketId);
		if (!player || !player.lobby)
			return undefined;
		return (player.lobby.id);
	}
	connectPlayer(data: {id: number, socket: Socket}): void {
		if (data) {
			if (!this.isPlayer(data.socket.id)) {
				const player = new Player(data.socket, data.id);
				this.players.set(data.socket.id, player);
				const payload: ServerPayloads[ServerEvents.AuthState] = {
					lobbyId: null,
					hasStarted: false,
				  }
				this.logger.log(`${player.id} is Online`);
				player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
			}
			else {
				this.updatePlayer(data);
			}
		}
	}
	disconnectPlayer(client: Socket): boolean {
		const player  = this.getPlayer(client);
		if (!player)
			return false;
		this.logger.log(`${player.id} is Offline`);
		return (true);
	}
	updatePlayer(data: {id: number, socket: Socket}): void {
		this.players.forEach(e => {
			if (data.id == e.id) {
				e.setOnline(data.socket);
				this.logger.log(`${e.id} is Online`);
				const payload: ServerPayloads[ServerEvents.AuthState] = {
					lobbyId: e.lobby == null ? null : e.lobby.id,
					hasStarted: e.lobby == null ? false : e.lobby.instance.hasStarted,
				  }
				e.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
			}
		});
	}
	getPlayerById(socketId: string) {
		return (this.players.get(socketId));
	}
	getPlayer(socket: Socket): Player | undefined {
		return (this.players.get(socket.id));
	}
	removePlayerById(id: string) {
		this.players.delete(id);
	}
	removePlayer(player: Player) {
		this.players.delete(player.socket.id);
	}
	isPlayer(socketId: string) {
		return (this.players.get(socketId));
	}
	getPlayersOnline() {
		return (this.players);
	}
}
