import {  create, useStore } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Input } from "./InputState";

export interface PlayerState {
	isPlaying: boolean;
	isAuth: boolean;
	lobbyId: string | null,
	input: Input,
	setIsPlaying: ( isPlaying: boolean) => void;
	setIsAuth: ( isAuth: boolean ) => void;
	setLobbyId: ( lobbyId: string | null ) => void;
	setInput: (input: Input) => void;
}
export const usePlayerStore = create<PlayerState>()((set) => ({
	isPlaying: false,
	isAuth: false,
	lobbyId: null,
	input: {
		up: false,
		right: false,
		down: false,
		left: false,
		boost: false,
	},
	setIsPlaying: (isPlaying: boolean) => set(() => ({isPlaying})),
	setIsAuth: (isAuth: boolean) => set(() => ({isAuth})),
	setLobbyId: (lobbyId: string | null) => set(() => ({lobbyId})),
	setInput: (input: Input) => set(() => ({input})),
}))