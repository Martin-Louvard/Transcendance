
import { Server, Socket } from "socket.io";
import { LobbyMode, LobbySlot, LobbySlotType, ServerEvents, ServerPayloads } from "../../Types";
import { Player } from "../player/player.class";
import { v4 as uuidv4, v4 } from 'uuid';
import { Instance } from "../classes/instance.class";
import { Injectable } from '@nestjs/common';

@Injectable()
export class Lobby {
	constructor(mode: LobbyMode, private readonly server: Server) {
		if (mode == LobbyMode.double)
			this.mode = mode;
		else
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
		if (this.nbPlayers == (this.mode == LobbyMode.duel ? 2 : 4)) {
			this.full = true;
			this.instance.triggerStart();
		}
		player.lobby = this;
		player.socket.join(this.id);
		return true;
	}
	removePlayer(player: Player):boolean {
		if (player.lobby == null || !player)
			return false;
		player.socket.leave(this.id);
		let isDeleted = this.players.delete(player.socket);
		if (isDeleted) {
			player.lobby = null;
			player.isReady = false;
			this.nbPlayers--;
			this.full = false; // normalement pas besoin de check.
			return false;
		}
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
			this.removePlayer(player);
			this.players.delete(player.socket);
		})
		this.instance.clear();
		delete this.instance;
		return null;
	}
}
