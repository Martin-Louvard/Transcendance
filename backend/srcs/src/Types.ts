import { Client } from "socket.io/dist/client";
import { Player } from "./game/player/player.class";
import { LobbySlotType } from "@shared/class";

export type LobbySlot  = () => {
	full: boolean;
	type: LobbySlotType;
	player: Player | null;
}
