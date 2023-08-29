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
			if (!this.isPlayerById(data.id)) {
				console.log("IL NEXISTE PAS")
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
		player.setOffline();
		this.logger.log(`${player.id} is Offline`);
		return (true);
	}
	updatePlayer(data: {id: number, socket: Socket}): void {
		const player: Player = this.getPlayerById(data.id);
		console.log(data.id);
		this.removePlayerById(data.id);
		player.setOnline(data.socket);
		this.players.set(data.socket.id, player);
		console.log(`player updated and in lobby : ${player.lobby ? player.lobby.id : "null"}`);
		this.logger.log(`${player.id} is Online`);
		const payload: ServerPayloads[ServerEvents.AuthState] = {
			lobbyId: player.lobby == null ? null : player.lobby.id,
			hasStarted: player.lobby == null ? false : player.lobby.instance.hasStarted,
		};
		player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
	}
	getPlayerBySocketId(socketId: string) {
		return (this.players.get(socketId));
	}
	getPlayerById(id: number) {
		let player: Player = null;
		this.players.forEach((e) => {
			if (e.id == id) {
				player = e;
				return ;
			}
		})
		return (player);
	}
	getPlayer(socket: Socket): Player | undefined {
		return (this.players.get(socket.id));
	}
	removePlayerBySocketId(id: string) {
		this.players.delete(id);
	}
	removePlayerById(id: number) {
		//let toDelete: Player = null;
		this.players.forEach((e, key) => {
			if (e.id == id) {
				this.players.delete(key);
				return ;
			}
		})
		//if (toDelete) {
		//	console.log(toDelete.socket);

		//	this.players.delete(toDelete.socket.id);
		//}
	}
	removePlayer(player: Player) {
		this.players.delete(player.socket.id);
	}
	isPlayer(socketId: string) {
		return (this.players.get(socketId));
	}
	isPlayerById(id: number) {
		let isPlayer: boolean = false;
		this.players.forEach((e) => {
			console.log(`${e.id} == ${id}`);
			if (e.id == id) {
				isPlayer = true;
				return ;
			}
		})
		return (isPlayer);
	}
	getPlayersOnline() {
		return (this.players);
	}
}
