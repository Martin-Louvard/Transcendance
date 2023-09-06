import { createSlice } from '@reduxjs/toolkit';
import {PlayerBody, Ball } from '@shared/class'

interface WebSocketState {
  isConnected: boolean;
  score: {home: number, visitor: number};
  balls: Ball[];
  players: PlayerBody[];
  mapWidth: number;
  mapHeight: number;
  elapsedTime: number;
  lobbyId: number | null;
  isPlaying: boolean;
}

const initialState: WebSocketState = {
  isConnected: false,
  score: {home: 0, visitor: 0},
  balls: [],
  players: [],
  mapWidth: 0,
  mapHeight: 0,
  elapsedTime: 0,
  lobbyId: 0,
  isPlaying: false,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    websocketConnected: (state) => {
      console.log("connected")
      state.isConnected = true;
    },
    websocketDisconnected: (state) => {
      console.log("disconnected")
      state.isConnected = false;
      state.lobbyId = null;
      state.isPlaying =false;
    },
    setGameState: (state, action) => {
      state.score = action.payload.gameData.score;
      state.balls = action.payload.gameData.balls;
      state.players = action.payload.gameData.players;
      state.mapWidth = action.payload.gameData.mapWidth;
      state.mapHeight = action.payload.gameData.mapHeight;
      state.elapsedTime = action.payload.gameData.elapsedTime;
    },
    setAuthState: (state, action) => {
      //console.log('game reducer: Auth State')
      console.log(action.payload);
      state.lobbyId = action.payload.lobbyId;
      state.isPlaying = action.payload.hasStarted
    },
    setLobbyState: (state, action) => {
      //console.log('game reducer: lobby State')
      if (!state.lobbyId)
        state.lobbyId = action.payload.lobbyId;
      if (action.payload.hasStarted && !state.isPlaying)
            state.isPlaying = true;
      if (action.payload.hasStarted) {
        state.isPlaying = true;
      }
    }
  },
});

export const { websocketConnected, websocketDisconnected, setGameState, setAuthState, setLobbyState } = websocketSlice.actions;

export default websocketSlice.reducer;
