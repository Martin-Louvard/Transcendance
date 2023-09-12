
import { Server, Socket } from "socket.io";
import { ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads, InputPacket, GameParameters,PlayerInfo, LobbySlotCli, LobbySlotType } from '@shared/class';
import { Player } from "../player/player.class";
import { v4 as uuidv4, v4 } from 'uuid';
import { Instance } from "../classes/instance.class";
import { Injectable } from '@nestjs/common';
import { LobbySlot } from "src/Types";

@Injectable()
export class Lobby {
	constructor(mode: LobbyMode, private readonly server: Server, creator: Player) {
		this.mode = mode;
		this.id = uuidv4();
		this.instance = new Instance(this);
		this.full = false;
		this.owner = creator;
		this.slots = [{full: true, type: 0, player: {username: creator.infos.username, avatar: creator.infos.avatar, id: creator.id }}, {full: false, type: 0, player: null}, {full: false, type: 0, player: null}, {full: false, type: 0, player: null}];
	};

	id: string;
	mode: LobbyMode;
	players: Map<string, Player> = new Map<string, Player>();
	slots: LobbySlotCli[];
	nbPlayers: number = 0;
	instance: Instance;
	full: boolean;
	params: {};
	owner: Player = null;

	public static fromGameParameter(params: GameParameters, server: Server, creator: Player): Lobby {
		const lobby = new Lobby(params.duel ? LobbyMode.duel : LobbyMode.double, server, creator);
		lobby.instance.setParams(params);
		return (lobby);
	}

	public setSlots(slots: LobbySlotCli[]) { this.slots = JSON.parse(JSON.stringify(slots))}

	public isOnlineSlot(): boolean {
		let isOnlineSlot = false;
		this.slots.forEach((e) => {
			if (!e.full && e.type == LobbySlotType.online)
				isOnlineSlot = true;
		})
		return (isOnlineSlot);
	}
 	connectPlayer(player: Player):boolean {
		if (player.lobby != null || this.full || !player) {
			console.log(`error in connection, player lobby = ${player.lobby}, full = ${this.full}, player = ${player}`);
			return false;
		}
		this.players.set(player.socket.id, player);
		this.nbPlayers++;
		player.lobby = this;
		player.socket.join(this.id);
		if (this.slots && this.slots.length > 0) {
			console.log('before, ', this.slots);
			this.slots[this.players.size - 1] = {full: true, type: 0, player: player.infos};
			this.emit<ServerPayloads[ServerEvents.LobbySlotsState]>(ServerEvents.LobbySlotsState, this.slots);
			console.log('after, ', this.slots);
		}
		if (this.nbPlayers == this.mode) {
			this.full = true;
			if (this.instance.automatch)
				this.instance.triggerStart();
			else
				this.emit<boolean>(ServerEvents.LobbyFull, true);
			return ;
		}
		this.dispatchAuthState();
		return true;
	}
	deletePlayerFromSlot(player: Player) {
		if (!this.slots || this.slots.length < 1)
			return ;
		let delIndex = -1;
		this.slots.forEach((slot, index) => {
			if (slot.player && slot.player.username == player.infos.username) {
				slot.full = false;
				slot.player = null;
				delIndex = index;
				return ;
			}
		})
		for (let i = 0; i < this.slots.length - 1; i++) {
			if (this.slots[i] && !this.slots[i].player && this.slots.at(i + 1).player)
				[this.slots[i], this.slots[i + 1]] = [this.slots[i + 1], this.slots[i]];
		}
		this.emit<ServerPayloads[ServerEvents.LobbySlotsState]>(ServerEvents.LobbySlotsState, this.slots);
	}

	removePlayer(player: Player):boolean {
		try {

			if (player.lobby == null || !player) {
				console.log("remove player error");
				return false;
			}
			player.socket.leave(this.id);
			let isDeleted = this.players.delete(player.socket.id);
			console.log(`player lobby size : ${this.players.size}`);
			if (isDeleted) {
				console.log("player deleted");
				player.isReady = false;
				player.lobby = null;
				this.nbPlayers--;
				if (this.full)
					this.emit<boolean>(ServerEvents.LobbyFull, false);
				this.full = false; // normalement pas besoin de check.
				let payload: ServerPayloads[ServerEvents.AuthState] = {
					lobbyId: null,
					hasStarted: null,
					owner: this.owner.infos.username,
				}
				if (this.owner.id == player.id && this.players.size > 0) {
					this.players.forEach((e) => {
						this.owner = e;
						return ;
					})
				}
				this.dispatchAuthState();
				player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
				this.deletePlayerFromSlot(player);
				return true;
			} // if not deleted we try different way
			this.players.forEach((e, key) => {
				if (e.id == player.id) {
					this.players.delete(key);
					player.isReady = false;
					player.lobby = null;
					this.nbPlayers--;
					this.full = false; // normalement pas besoin de check.
					const payload: ServerPayloads[ServerEvents.AuthState] = {
						lobbyId: null,
						hasStarted: null,
						owner: this.owner.infos.username,
					}
					player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
					if (this.owner.id == player.id && this.players.size > 0) {
						this.players.forEach((e) => {
							this.owner = e;
							return ;
						})
					}
					console.log(`player socket id : $${player.socket.id} and id in the array : ${e.socket.id}`);
					this.dispatchAuthState();
					player.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
					this.deletePlayerFromSlot(player);
					return true
				}
			})
			console.log(`player not deleted ${player.socket.id} id : ${player.id}`)
			return false;
		} catch(error) {
			console.log(error);
		}
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

	public dispatchAuthState() {
		const payload: ServerPayloads[ServerEvents.AuthState] = {
			lobbyId: this.id,
			hasStarted: this.instance.hasStarted,
			owner: this.owner.infos.username
		}
		console.log('owner: ', this.owner.infos.username);
		this.emit<ServerPayloads[ServerEvents.AuthState]>(ServerEvents.AuthState, payload);
	}

	public dispatchLobbyState() {
		let playersInfos = new Array<PlayerInfo>();
		this.players.forEach((e) => {
			let info: PlayerInfo = e.infos
			playersInfos.push(info);
		})
		const payload: ServerPayloads[ServerEvents.LobbyState] = {
			lobbyId: this.id,
			mode: this.mode,
			hasStarted: this.instance.hasStarted,
			hasFinished: this.instance.hasFinished,
			playersCount: this.nbPlayers,
			isSuspended: this.instance.isSuspended,
			playersInfo: playersInfos,
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
			this.players.delete(player.socket.id);
		})
		this.instance.clear();
		delete this.instance;
		return null;
	}
}
