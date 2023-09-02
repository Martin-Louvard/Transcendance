
import { Server, Socket } from "socket.io";
import { ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads, InputPacket } from '@shared/class';
import { Player } from "../player/player.class";
import { v4 as uuidv4, v4 } from 'uuid';
import { Instance } from "./instance.class";
import { Injectable } from '@nestjs/common';
import { LobbySlot } from "src/Types";

@Injectable()
export class Lobby {
	constructor(mode: LobbyMode, private readonly server: Server) {
		this.mode = mode;
		this.id = uuidv4();
		this.instance = new Instance(this);
		this.full = false;
	};

	id: string;
	mode: LobbyMode;
	players: Map<Socket, Player> = new Map<Socket, Player>();
	slots: LobbySlot[];
	nbPlayers: number = 0;
	instance: Instance;
	full: boolean;
	params: {};

	connectPlayer(player: Player):boolean {
		if (player.lobby != null || this.full || !player) {
			return false;
		}
		this.players.set(player.socket, player);
		this.nbPlayers++;
		if (this.nbPlayers == this.mode) {
			this.full = true;
			this.instance.triggerStart();
		}
		player.lobby = this;
		player.socket.join(this.id);
		return true;
	}
	removePlayer(player: Player):boolean {
		if (player.lobby == null || !player) {
			console.log("remove player error");
			return false;
		}
		player.socket.leave(this.id);
		let isDeleted = this.players.delete(player.socket);
		if (isDeleted) {
			console.log("player deleted");
			player.isReady = false;
			player.lobby = null;
			this.nbPlayers--;
			this.full = false; // normalement pas besoin de check.
			const payload: ServerPayloads[ServerEvents.AuthState] = {
				lobbyId: null,
				hasStarted: null,
			  }
			player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
			return false;
		}
		console.log(`player not deleted ${player.socket.id} id : ${player.id}`)
		return true;
	}
	setPlayerOffline(player: Player):boolean {
		if (!player || !player.lobby)
			return false;
		player.socket.leave(this.id);
	}
	setPlayerOnline(player: Player):boolean {
		if (!player || !player.lobby)
			return false;
		player.socket.join(this.id);
	}
	isAllReady(): boolean {
		this.players.forEach(e=> {
			if (!e.isReady)
				return false;
		});
		return true;
	}

	public dispatchLobbyState() {
		const payload: ServerPayloads[ServerEvents.LobbyState] = {
			lobbyId: this.id,
			mode: this.mode,
			hasStarted: this.instance.hasStarted,
			hasFinished: this.instance.hasFinished,
			playersCount: this.nbPlayers,
			isSuspended: this.instance.isSuspended,
		}
		this.emit<ServerPayloads[ServerEvents.LobbyState]>(ServerEvents.LobbyState, payload);
	}
	public emit<T>(event: ServerEvents, payload: T) {
		this.server.to(this.id).emit(event, payload);
	}
	
	clear() {
		this.players.forEach((player) => {
			console.log("player deleting");
			this.removePlayer(player);
			this.players.delete(player.socket);
		})
		this.instance.clear();
		delete this.instance;
		return null;
	}
}
