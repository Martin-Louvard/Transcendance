import {  create, useStore } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { LobbyMode } from "./Type";

export interface PlayerState {
	isPlaying: boolean;
	isAuth: boolean;
	lobbyId: string | null,
	setIsPlaying: ( isPlaying: boolean) => void;
	setIsAuth: ( isAuth: boolean ) => void;
	setLobbyId: ( lobbyId: string | null ) => void;
}
export const usePlayerStore = create<PlayerState>()((set) => ({
	isPlaying: false,
	isAuth: false,
	lobbyId: null,
	setIsPlaying: (isPlaying: boolean) => set(() => ({isPlaying})),
	setIsAuth: (isAuth: boolean) => set(() => ({isAuth})),
	setLobbyId: (lobbyId: string | null) => set(() => ({lobbyId})),
}))