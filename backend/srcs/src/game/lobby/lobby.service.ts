import { Body, Get, Injectable, Logger, OnModuleInit, Post, Query } from '@nestjs/common';
import { Lobby } from './lobby.class';
import { LobbyMode, InputPacket, GameParameters, PlayerInfo, ServerEvents, ServerPayloads, GameRequest, ClientPayloads, ClientEvents, LobbyCli, LobbySlotType, Game } from '@shared/class';
import { Player } from '../player/player.class';
import { Server } from 'socket.io';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PlayerService } from '../player/player.service';
import { v4 } from 'uuid';
import { ClassicInstance } from '../classes/classicInstance';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LobbyService {
	public constructor(private readonly playerService: PlayerService, private readonly prismaService: PrismaService) {
	}
	private readonly logger = new Logger("LobbyService");
	private lobbies: Map<string, Lobby> = new Map<string, Lobby>();
	server: Server;
	requests: Map<string, GameRequest> = new Map<string, GameRequest>();
	listeners: Map<number, Player> = new Map<number, Player>();


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
		if (lobby) {
			this.lobbies.set(lobby.id, lobby);
			this.dispatchEvent();
		}
	}

	leaveLobby(player: Player) {
		if (!player.lobby)
			return false;
		const lobby = player.lobby;
		if (lobby && lobby.instance && lobby.instance.hasStarted && !lobby.instance.hasFinished) {
			lobby.instance.triggerFinishSurrender(player);
			return ;
		}
		
		this.playerService.deleteRequests(player.id, player.id);
		lobby.removePlayer(player);
		this.logger.log(`${player.id} leave lobby ${lobby.id}`);
		player.lobby = null;
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
		this.dispatchEvent();
		return (true);
	}

	dispatchEvent() {
		this.listeners.forEach((e) => {
			e.emit(
				ServerEvents.ListLobbies,
				this.getJoinableLobbies(),
			  );
		})
	}

	addListener(id: number) {
		const player = this.playerService.getPlayer(id);
		if (!player)
			return ;
		this.logger.log(`${id} is now listening to lobbies`);
		this.listeners.set(id, player);
	}

	removeListener(id: number) {
		const player = this.playerService.getPlayer(id);
		if (!player)
			return ;
		this.listeners.delete(id);
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
			this.dispatchEvent();
			return lobby;
		} catch (error) {
			return null;
		}
	}

	getLobby(id: string) {
		return (this.lobbies.get(id));
	}

	getJoinableLobbies() {
		let lobbies:LobbyCli[] = [];
		this.lobbies.forEach((e) => {
			if (e.instance && !e.instance.hasStarted && !e.instance.automatch && e.isOnlineSlot())
				lobbies.push({id: e.id, slots: e.mode == LobbyMode.duel ? e.slots.slice(0, 2) : e.slots, creator: e.owner.infos, size: e.mode == LobbyMode.duel ? 2 : 4});
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
				this.dispatchEvent();
			} else {
				const lobby = Lobby.fromGameParameter(params, server, creator);
				if (!lobby)
					return ;
				this.logger.log(`Lobby ${lobby.id} created`);
				lobby.connectPlayer(creator);
				this.logger.log(`creator ${creator.id} joined ${lobby.id}`);
				this.lobbies.set(lobby.id, lobby);
				lobby.dispatchLobbyState();
				this.dispatchEvent();
			}
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

	removeLobbyById(id: string) {
		this.lobbies.delete(id);
		this.dispatchEvent();
	}

	removeLobby(lobby: Lobby) {
		try {
			this.lobbies.delete(lobby.id)
			this.dispatchEvent();
			this.logger.log(`lobby ${lobby.id} removed`);
		} catch (error) {
			return error
		}
	}

	joinLobby(player: Player, data: {lobbyId: string, info: PlayerInfo}) {
		const lobby = this.findLobbyById(data.lobbyId);
		if (!lobby) {
			return 'lobby not found';
		}
		if (player.lobby)
			player.lobby.removePlayer(player);
		lobby.connectPlayer(player);
		this.dispatchEvent();
		return ;
	}

	automatch(player: Player, data: {mode: LobbyMode, info: PlayerInfo}, server: Server):boolean {
		try {
			if (!player || player.lobby)
				return ;
			let lobbyFinded: boolean = false;
			this.lobbies.forEach(lobby => {
				if (data.mode == lobby.mode && lobby.instance && !lobby.instance.hasStarted && lobby.instance.automatch) {
					this.logger.log(`player ${player.id} joined ${lobby.id}`);
					lobby.connectPlayer(player);
					lobbyFinded = true;
					lobby.dispatchLobbyState();
					this.dispatchEvent();
					return ;
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

	automatchClassic(player: Player, data: {info: PlayerInfo}, server:Server): boolean {
		try {
			if (!player || player.lobby)
				return ;
			let lobbyFinded: boolean = false;
			this.lobbies.forEach(lobby => {
				if (lobby.instance instanceof ClassicInstance && !lobby.instance.hasStarted) {
					this.logger.log(`player ${player.id} joined ${lobby.id}`);
					lobby.connectPlayer(player);
					lobbyFinded = true;
					lobby.dispatchLobbyState();
					this.dispatchEvent();
					return ;
				}
			});
			if (!lobbyFinded) {
				this.createLobby(LobbyMode.classic, server, player);
			}
			return true;
		} catch (error) {
			return error
		}
	}

	invitePlayer(player: Player, data: ClientPayloads[ClientEvents.GameSendRequest]): boolean {
		if (!player || !player.getIsOnline())
		  return false
		const sender = this.playerService.getPlayerById(data.senderId);
		if (!sender || !sender.getIsOnline() || !sender.lobby || !sender.infos)
			return false
		const lobby = this.lobbies.get(data.lobbyId);
		if (!lobby || !lobby.instance || !lobby.instance.getParams())
			return false;
		let isAlreadyInvited = false;
		this.playerService.requests.forEach((req) => {
			if (player.id == req.receiver.id) {
				isAlreadyInvited = true;
				return ;
			}
		})
		if (isAlreadyInvited)
			return false;
		const payload: GameRequest = {
		  sender: sender.infos,
		  receiver: player.infos,
		  lobby: {
			id: sender.lobby.id,
			params: lobby.instance.getParams(),
		  },
		  id: v4(),
		  timestamp: Date.now(),
		}
		for (let index = 0; index < lobby.slots.length; index++) {
			const e = lobby.slots[index];
			if (!e.full && e.type == LobbySlotType.friend) {
				e.type = LobbySlotType.invited;
				e.player = player.infos;
				break ;
			}
		}
		lobby.dispatchLobbySlots();
		this.playerService.addRequest(payload);
	  }

	async postGame(id: string) {
		const lobby = this.lobbies.get(id);
		if (!lobby)
			return ;
		const players = [...lobby.players.values()];
		const duel =  lobby.mode == LobbyMode.duel || lobby.instance instanceof ClassicInstance || players.length <= 2;
		if (players.length < 2)
			return ;
		const users = await this.prismaService.user.findMany({
			where: {
				id: {in: duel ? [players[0].id, players[1].id] : [players[0].id, players[1].id, players[2].id, players[3].id]},
			},
		});
		const visitorInfos = players.filter((pl) => pl.team == 'visitor');
		const homeInfos = players.filter((pl) => pl.team == 'home');
		if (homeInfos.length < 1 || visitorInfos.length < 1)
			return ;
		const visitor = await this.prismaService.user.findMany({
			where: {
				id: {in: duel ? [visitorInfos[0].id] : [visitorInfos[0].id, visitorInfos[1].id]},
			}
		})
		const home = await this.prismaService.user.findMany({
			where: {
				id: {in: duel ? [homeInfos[0].id] : [homeInfos[0].id, homeInfos[1].id]},
			}
		})
		const visitorScore = lobby.instance.data.score.visitor
		const homeScore = lobby.instance.data.score.home
		const gameData = {
			scoreHome: homeScore,
			scoreVisitor: visitorScore,
			players: {
			  connect: users.map((user) => ({ id: user.id })),
			},
			home: {
			  connect: home.map((user) => ({ id: user.id })),
			},
			visitor: {
			  connect: visitor.map((user) => ({ id: user.id })),
			},
			winner: homeScore > visitorScore ? 'home' : homeScore < visitorScore ? 'visitor' : 'draw',
		  };
		
		  try {
			const game = await this.prismaService.game.create({
			  data: gameData,
			});

		  } catch (error) {
			console.error("Error creating a game:", error);
		  }
		  try {
			await this.prismaService.user.updateMany({
				where: {
					id: {
						in: home.map((user) => ( user.id ))
					}
				},
				data: {
					defeatCount: {increment: homeScore < visitorScore ? 1 : 0},
					victoriesCount: {increment: homeScore > visitorScore ? 1 : 0},
				}
			});
			await this.prismaService.user.updateMany({
				where: {
					id: {
						in: visitor.map((user) => ( user.id ))
					}
				},
				data: {
					defeatCount: {increment: visitorScore < homeScore ? 1 : 0},
					victoriesCount: {increment: visitorScore > homeScore ? 1 : 0},
				}
			});

		  } catch (error) {
			console.error("Error creating a game:", error);
		  }
		}
		

	async getGames(playerId: number) {
		const gamesForPlayer = await this.prismaService.game.findMany({
			where: {
			  players: {
				some: {
				  id: playerId,
				},
			  },
			},
		  });
		return (gamesForPlayer);
	}

	// TODO: Pour le moment on clear tout toues les 5 minutes, une fois le jeu codé il faudra
	// TODO... clear que les games terminé toutes les 5 minutes
	@Cron(CronExpression.EVERY_5_SECONDS,
		{name: 'lobby_cleaner'})
	clearLobbies() {
		this.lobbies.forEach(async (lobby: Lobby) => {
			if (lobby.instance.hasFinished) {
				await this.postGame(lobby.id);
				this.logger.log(`Lobby ${lobby.id} deleted`);
				lobby.clear();
				this.lobbies.delete(lobby.id);
				this.dispatchEvent();
			}
		})
		//this.logger.log("Lobbies cleaned");
	}
}
