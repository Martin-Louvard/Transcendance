export enum LobbyMode {
	duel = 2,
	double = 4,
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

  InputState = 'client.input.state'
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
	[ClientEvents.InputState]: InputPacket
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
} // A changer avec une methode de compression

export interface Input {
	up: Boolean,
	right: Boolean,
	down: Boolean,
	left: Boolean,
	boost: Boolean,
	rotRight: Boolean,
	rotLeft: Boolean,
}

export interface InputPacketInterface {
	code: number;
	timestamp: number;
} 

export class InputPacket implements InputPacketInterface {
	code: number;
	timestamp: number;
} // A changer avec une methode de compression