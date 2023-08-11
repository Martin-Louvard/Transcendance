
export enum LobbyMode {
	duel = 0,
	double = 1,
}

export enum ServerEvents
{
  // General
  Pong = 'server.pong',
  // Lobby
  LobbyState = 'server.lobby.state',

  GameState = 'server.game.state',

  AuthState = 'server.auth.state',
}

export enum ClientEvents
{
  GameState = 'client.game.state',

  AuthState = 'client.auth.state',

  LobbyState = 'client.lobby.state',
}

export type ServerPayloads = {
	[ServerEvents.LobbyState]: {
		lobbyId: string;
	  	mode: LobbyMode;
	  	hasStarted: boolean;
	  	hasFinished: boolean;
	  	playersCount: number;
	  	isSuspended: boolean;
	},
	[ServerEvents.GameState]: {
		scores: {home: number, visitor: number};
		gameData: GameData;
	},
	[ServerEvents.AuthState]: {
		lobbyId: string | null,
		hasStarted: boolean,
	}
};

export type ClientPayloads = {
	[ClientEvents.LobbyState]: {
		leaveLobby: boolean | null,
		automatch: boolean | null,
		mode: LobbyMode | null,
	},
	[ClientEvents.AuthState]: {
		id: number,
		token: string,
	},
	[ClientEvents.GameState]: {
		test: number,
	},
};

export interface PlayerBody {
	position: [number, number, number];
	size: [number, number, number];
}

export interface Ball {
	position: [number, number, number],
	size: number,
}

export interface GameData {
	balls: Ball[],
	players: PlayerBody[],
	mapWidth: number,
	mapHeight: number,
}