import { Server, Socket } from "socket.io";
import { Player } from "./player.class";
import { Injectable, Logger } from '@nestjs/common';
import { GameRequest, ServerEvents, ServerPayloads } from "@shared/class";
import { Lobby } from "../lobby/lobby.class";

@Injectable()
export class PlayerService {
	constructor() {
	}
	private readonly logger = new Logger("PlayerService");
	/* Player Handling */
	players: Map<number, Player> = new Map<number, Player>();
	requests: Map<string, GameRequest> = new Map<string, GameRequest>();

	getLobby(socketId: string): Lobby | undefined {
		const player = this.getPlayerBySocketId(socketId);
		if (!player || !player.lobby)
			return undefined;
		return (player.lobby);
	}
	connectPlayer(data: {id: number, avatar: string, username: string, socket: Socket}): void {
		if (data) {
			const player = this.players.get(data.id);
			if (!player) {
				const player = new Player(data.socket, data.id);
				player.infos = {id: data.id, username: data.username, avatar: data.avatar};
				this.players.set(data.id, player);
				const payload: ServerPayloads[ServerEvents.AuthState] = {
					lobbyId: null,
					hasStarted: false,
					owner: null
				  }
				this.logger.log(`${player.id} is Online`);
				player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
			}
			else {
				this.updatePlayer(data, player);
			}
		}
	}
	disconnectPlayer(player: Player): boolean {
		if (!player)
			return false;
		player.setOffline();
		this.logger.log(`${player.id} is Offline`);
		return (true);
	}
	updatePlayer(data: {id: number, username: string, avatar: string, socket: Socket}, player: Player): void {
		player.infos = {id: data.id, username: data.username, avatar: data.avatar};
		player.socket = data.socket;
		player.setOnline(data.socket);
		this.logger.log(`${player.id} is Online`);
		const payload: ServerPayloads[ServerEvents.AuthState] = {
			lobbyId: player.lobby == null ||  !player.lobby.instance  ? null : player.lobby.id,
			hasStarted: player.lobby == null || !player.lobby.instance ? false : player.lobby.instance.hasStarted,
			owner: player.lobby && player.lobby.owner  ? player.lobby.owner.infos.username : null,
		};
		player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
	}
	getPlayerBySocketId(socketId: string): Player | undefined {
		let player = null;
		this.players.forEach((pl => {
			if (pl.socket && pl.socket.id == socketId) {
				player = pl;
				return ;
			}
		}))
		return (player);
	}
	getPlayerById(id: number) {
		return (this.players.get(id));
	}
	getPlayer(id: number): Player | undefined {
		return (this.players.get(id));
	}
	removePlayer(player: Player) {
		this.players.delete(player.id);
	}
	removePlayerById(id: number) {
		this.players.delete(id);
	}
	isPlayerId(id: number) {
		return (this.players.get(id));
	}
	isPlayerBySocketId(socketId: string) {
		let isPlayer: boolean = false;
		this.players.forEach((e) => {
			if (e.socket.id == socketId) {
				isPlayer = true;
				return ;
			}
		})
		return (isPlayer);
	}
	getPlayersOnline() {
		return (this.players);
	}

	public deleteRequests(senderId?: number, receiverId?: number, lobbyId?: string, id?:string, all?: boolean) { // le parametre all ne fusionne pas avec les autres, si true : tous est delete
		if (all) {
			this.requests.clear()
			this.dispatchGameRequest();
			return ;
		}
		else {
			this.requests.forEach((req) => {
				if ((!lobbyId || (lobbyId && req.lobby.id == lobbyId)) || (!id || (id && id == req.id)) ||
				(!senderId || (senderId == req.sender.id)) || (!receiverId || (receiverId == req.receiver.id))) {// delete le player en fonction de tous les parametres, les parametres sont fusionnel.
					this.requests.delete(req.id);
				}
			})
		}
		this.dispatchGameRequest();
	}

	public deleteAllRequests() {
		this.deleteRequests(undefined, undefined, undefined, undefined, true);
	}

	public dispatchPlayerRequest(player: Player) {
		if (!player)
			return ;
		const sent: GameRequest[] = [];
		const received: GameRequest[] = [];
		this.requests.forEach((req) => {
			if (req.receiver.id == player.id) {
				received.push(req);
			} else if (req.sender.id == player.id) {
				sent.push(req);
			}
		})
		const payload = {
			sent: sent,
			received: received,
		}
		player.emit<ServerPayloads[ServerEvents.GameRequest]>(ServerEvents.GameRequest, payload);
	}

	public dispatchGameRequest() {
		this.players.forEach((player) => {
			if (!player)
				return ;
			const sent: GameRequest[] = [];
			const received: GameRequest[] = [];
			this.requests.forEach((req) => {
				if (req.receiver.id == player.id) {
					received.push(req);
				} else if (req.sender.id == player.id) {
					sent.push(req);
				}
			})
			const payload = {
				sent: sent,
				received: received,
			}
			player.emit<ServerPayloads[ServerEvents.GameRequest]>(ServerEvents.GameRequest, payload);
		})
	}

	public addRequest(req: GameRequest) {
		const sender = this.players.get(req.sender.id);
		const receiver = this.players.get(req.receiver.id);
		if (!sender || !receiver)
			return false;
		this.requests.set(req.id, req);
		this.dispatchPlayerRequest(receiver);
		this.dispatchPlayerRequest(sender);
		return true;
	}
}
