import { Socket } from "socket.io";
import { Lobby } from "../lobby/lobby.class";
import { ClientEvents, PlayerInfo, ServerEvents } from "@shared/class";

export class Player {
	constructor(socket: Socket, id :number) {
		this.socket = socket;
		this.id = id;
		this.isReady = false;
		this.lobby = null;
		this.isOnline = true;
	};
	team: 'home' | 'visitor';
	id: number;
	socket: Socket | null;
	lobby: Lobby | null;
	isReady: boolean;
	isOnline: boolean;
	infos: PlayerInfo;

	setReady( isReady: boolean  ): boolean {
		if (this.lobby == null || this.lobby.instance.hasStarted)
			return false;
		this.isReady = isReady;
		if (this.lobby.isAllReady()) 
			this.lobby.instance.triggerStart();
		return (true);
	}
	public emit<T>(event: ServerEvents, payload: T) {
		this.socket.emit(event, payload);
	}


	// TODO: Comment handle la deconnexion d'un jouer dans un game ?
	// TODO: Si le joueur est offline + de {secondes} quitter le lobby et terminer la game
	// TODO: Si c'était quand la partie a commencé, timeout de reconnection de {secondes} sinon l'autre joueur gagne.
	// TODO: Si c'est pendant le lobby, mettre le lobby en suspended (Personne ne peut join, timeout au bout de {secondes}).  
	setOffline( ) {
		this.isOnline = false;
		if (this.lobby)
			this.lobby.setPlayerOffline(this);
		this.socket = null;
	}
	setOnline(socket: Socket) {
		this.isOnline = true;
		this.socket = socket;
		if (this.lobby)
			this.lobby.setPlayerOnline(this);
	}
	// Les players ici ne contiennent aucune data `statique` de la DB. On a simplement
	// besoin de les Gets avec l'id du player au moment ou on veut les renders.

	
}