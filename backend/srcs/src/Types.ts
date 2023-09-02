import { Client } from "socket.io/dist/client";
import { Player } from "./game/player/player.class";

export enum LobbySlotType {
	friend = 0,
	online = 1,
	bot = 2,
}

export type LobbySlot  = () => {
	full: boolean;
	type: LobbySlot;
	player: Player | null;
}
