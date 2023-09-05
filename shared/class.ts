import * as CANNON from 'cannon-es'

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

  InputState = 'client.input.state',

  parameterState = 'client.parameter.state',
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
	[ClientEvents.InputState]: InputPacket,
	[ClientEvents.parameterState]: GameParameters,
};

export interface PlayerBody {
	position: [number, number, number];
	size: [number, number, number];
	quaternion: CANNON.Quaternion;
	id: number;
	team: 'home' | 'visitor',
}

export interface Ball {
	position: [number, number, number],
	quaternion: CANNON.Quaternion
	size: number,
}

export interface GameData {
	balls: Ball[],
	players: PlayerBody[],
	mapWidth: number,
	mapHeight: number,
	score: {home: number, visitor: number},
	elapsedTime: number,
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
	pressed: boolean;
	timestamp: number;
	id: number;
} // A changer avec une methode de compression

//PARAMETRAGE D'UN GAME :
//	0. PONG BASIC OU PONG ULTIMATE
//	1. DUEL / DOUBLE
//		1.1 SLOT D'AMI OU ONLINE OU BOT (si le temps)
//	2 PARAMETRE DE MAP :
//		2.1 TAILLE DE LA MAP
//		2.2 TAILLE DES CAGES
//		2.3 OFFSET DE LA LIGNE MEDIANE (la ou les joueurs ne peuvent plus avancer avant la ligne mediane)
//	3. PARAMETRE DE BALLE :
//		3.1 VITESSE DE LA BALLE CONTINU
//		3.2 FORCE DU REBOND
//		3.3 ACCELERATION DE LA BALLE AU FIL DU ROUND
//		3.4 VITESSE DE ROTATION DE LA BALLE
//	4. PARAMETRE DES JOUEURS
//		4.1 VITESSE DES JOUEURS
//		4.2 VITESSE DE ROTATIONS
//		4.3 VITESSE DU BOOST
//	5. PARAMETRE GLOBAL
//		5.1 TEMPS DE LA GAME

export interface GameParameters {
	classic: boolean,
	duel : boolean,
	map : {
		size: [number, number], // width, height
		goalSize: number, // width
		medianOffset: number, // length
	},
	ball : {
		globalSpeed: number, // speed
		reboundForce: number, // force du rebond
		ballAcceleration: number, // m / sec
		rotationForce: number, // force de rotation
	},
	players: {
		speed: number, // vitesse X et Z
		rotationSpeed: number, // vitesse de rotation
		boostForce: number, // force du boost
	},
	general : {
		time: number, // temps d'une game
	}
}