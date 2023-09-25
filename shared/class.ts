import * as CANNON from 'cannon-es'
import { User } from 'src/users/entities/user.entity';

export enum LobbyMode {
	classic = 0,
	duel = 2,
	double = 4,
}

export enum LobbyType {
	none = 0,
	auto = 1,
	create = 2,
	classic = 3,
	find = 4,
	wait = 5,
	score = 6,
}

export enum ServerEvents
{
  // General
  Pong = 'server.pong',
  // Lobby
  LobbyState = 'server.lobby.state',

  GameState = 'server.game.state',

  AuthState = 'server.auth.state',

  LobbySlotsState = 'server.lobby.slots.state',

  GameRequest = 'server.game.invitation',

  SuccessfulInvited = 'server.successfull.invite',

  DeleteGameRequest = 'server.delete.game.request',

  DeleteSentGameRequest = 'server.delete.sent.game.request',

  LobbyFull = 'server.lobby.full',

  GetLobbies = 'server.get.lobbies',

  ParametersState = 'server.parameters.state',

  ListLobbies = 'server.list.lobbies',
}

export enum ClientEvents
{
  GameState = 'client.game.state',

  AuthState = 'client.auth.state',

  LobbyState = 'client.lobby.state',

  InputState = 'client.input.state',

  ParameterState = 'client.parameter.state',

  LobbySlotsState = 'client.lobby.slots.state',

  GameSendRequest = 'client.game.send.request',

  JoinLobby = 'client.join.lobby',

  DeleteGameRequest = 'client.delete.game.request',

  StartGame = 'client.start.game',

  ListenLobbies = 'client.listen.lobbies',

  StopListenLobbies = 'client.stop.listen.lobbies',

  AddGame = 'client.add.game',

  CreateLobby = 'client.create.lobby',

  KickLobby = 'client.kick.lobby',
}

export interface LobbyCli {
	id: string,
	slots: LobbySlotCli[],
	creator: PlayerInfo,
	size: number,
}

export interface PlayerInfo {
	username: string;
	avatar: string;
	id: number;
}

export enum LobbySlotType {
	friend = 0,
	online = 1,
	bot = 2,
	invited = 3,
}

export interface LobbySlotCli  {
	full: boolean;
	type: LobbySlotType;
	player: PlayerInfo | null;
}

export interface GameRequest {
	sender: PlayerInfo,
	receiver: PlayerInfo,
	lobby: {
		id: string,
		params: GameParameters,
	}
	id: string,
	timestamp: number,
}


export type ServerPayloads = {
	[ServerEvents.LobbyState]: {
		lobbyId: string,
	  	mode: LobbyMode,
	  	hasStarted: boolean,
	  	hasFinished: boolean,
	  	playersCount: number,
	  	isSuspended: boolean,
		playersInfo: PlayerInfo[],
		winner: 'home' | 'visitor' | null,
		team: 'home' | 'visitor',
		score: {'home': number, 'visitor': number},
	},
	[ServerEvents.GameState]: {
		gameData: GameData;
	},
	[ServerEvents.AuthState]: {
		lobbyId: string | null,
		hasStarted: boolean,
		owner: string,
	},
	[ServerEvents.LobbySlotsState]: LobbySlotCli[],
	[ServerEvents.GameRequest]: {sent: GameRequest[], received: GameRequest[]},
	[ServerEvents.DeleteSentGameRequest]: GameRequest,
	[ServerEvents.DeleteGameRequest]: GameRequest,
	[ServerEvents.ParametersState]: GameParameters,
};

export type ClientPayloads = {
	[ClientEvents.LobbyState]: {
		leaveLobby: boolean | null,
		automatch: boolean | null,
		mode: LobbyMode | null,
		infos: PlayerInfo,
	},
	[ClientEvents.AuthState]: {
		id: number,
		token: string,
		owner: boolean,
	},
	[ClientEvents.InputState]: InputPacket,
	[ClientEvents.ParameterState]: GameParameters,
	[ClientEvents.LobbySlotsState]: LobbySlotCli[],
	[ClientEvents.GameSendRequest]: {
		senderId: number,
		receiverId: number,
		lobbyId: string,
	},
	[ClientEvents.AddGame]: {
		players: PlayerInfo[],
		score: {'home': number, 'visitor': number},
		home: PlayerInfo[],
		visitor: PlayerInfo[],
		winner: PlayerInfo,
	}
	[ClientEvents.CreateLobby]: {
		id: number,
	}
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

	//  model Game {
	//	id        Int      @id @default(autoincrement())
	//	scoreHome     Int
	//	scoreVisitor  Int
	//	players   User[]   @relation("PlayersInGame")
	//	home      User[]   @relation("HomeTeam")
	//	visitor   User[]   @relation("VisitorTeam")
	//	createdAt DateTime @default(now())
	//  }

export interface Game {
	id: number;
	createdAt: string;
	scoreHome: number;
	scoreVisitor: number;
	players: User[];
	home: User[];
	visitor: User[];
}