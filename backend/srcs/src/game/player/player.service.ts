import { Socket } from "socket.io";
import { Player } from "./player.class";
import { Injectable, Logger } from '@nestjs/common';
import { ServerEvents, ServerPayloads } from "src/Types";

@Injectable()
export class PlayerService {
	constructor() {
	}
	private readonly logger = new Logger("PlayerService");
	/* Player Handling */
	players: Array<Player> = new Array<Player>();

	connectPlayer(data: {id: number, socket: Socket}): void {
		if (data) {
			if (!this.isPlayer(data.id)) {
				const player = new Player(data.socket, data.id);
				this.players.push(player);
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
				console.log(e.lobby);
				const payload: ServerPayloads[ServerEvents.AuthState] = {
					lobbyId: e.lobby == null ? null : e.lobby.id,
					hasStarted: e.lobby == null ? false : e.lobby.instance.hasStarted,
				  }
				e.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
			}
		});
	}
	getPlayer(socket: Socket): Player | null {
		let finded: Player | null = null;
		this.players.forEach(e => {
			if (socket && socket.id === e.socket.id)
				finded = e;
		})
		return (finded);
	}
	removePlayer(player: Player) {
		const index = this.players.indexOf(player);
		if (index > -1) {
		  this.players.splice(index, 1);
		}
	}
	isPlayer(id: number) {
		for (let index = 0; index < this.players.length; index++) {
			const e = this.players[index];
			if (e.id == id)
				return (true);
		}
		return (false);
	}
	getPlayersOnline() {
		return (this.players);
	}
}
