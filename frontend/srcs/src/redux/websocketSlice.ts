import { createSlice, current } from '@reduxjs/toolkit';
import {PlayerBody, Ball, LobbyMode, LobbyType, PlayerInfo, GameParameters, LobbySlotCli, ServerPayloads, ServerEvents, LobbyCli, GameRequest, Paddle, PaddleCli } from '@shared/class'

export interface WebSocketState {
  isConnected: boolean;
  score: {home: number, visitor: number};
  balls: Ball[];
  players: PlayerBody[];
  mapWidth: number;
  mapHeight: number;
  elapsedTime: number;
  lobbyId: string | null;
  isPlaying: boolean;
  LobbyType: LobbyType;
  playersInfo: PlayerInfo[];
  params: GameParameters;
  owner: string | null;
  lobbySlots: LobbySlotCli[];
  inLobby: boolean;
  invitedGames: GameRequest[];
  sentInvites: GameRequest[];
  full: boolean;
  lobbies: LobbyCli[];
  lastGame: {score: {home: 0, visitor: 0}, winner: 'home' | 'visitor' | 'draw', team: 'home' | 'visitor', timestamp: number, players: PaddleCli[] | null} | null
  isWaitingToConnect: boolean;
  paramsReceived: boolean;
}

const initialState: WebSocketState = {
  isConnected: false,
  score: {home: 0, visitor: 0},
  balls: [],
  players: [],
  mapWidth: 0,
  mapHeight: 0,
  elapsedTime: 0,
  lobbyId: "",
  isPlaying: false,
  LobbyType: LobbyType.none,
  playersInfo: new Array<PlayerInfo>(),
  owner: null,
  lobbySlots: [],
  inLobby: false,
  params: {
   classic: false,
   duel: false,
   map: {
    size: [100, 200],
    goalSize: 40,
    medianOffset: 10,
   },
   ball: {
    globalSpeed: 50, // speed
    reboundForce: 100, // force du rebond
    ballAcceleration: 10, // m / sec
    rotationForce: 1, // force de rotation
   },
   players: {
    speed: 120, // vitesse X et Z
    rotationSpeed: 50, // vitesse de rotation
    boostForce: 10, // force du boost
    paddleSize: [12, 3, 2],
   },
   general: {
    time: 120,
   }
  },
  invitedGames: [],
  sentInvites: [],
  full: false,
  lobbies: [],
  lastGame: null,
  isWaitingToConnect: false,
  paramsReceived: false,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    websocketConnected: (state) => {
      state.isConnected = true;
    },
    websocketDisconnected: (state) => {
      state.isConnected = false;
      state.lobbyId = null;
      state.isPlaying =false;
    },
    setWaitingToConnect(state, action) {
        state.isWaitingToConnect = action.payload;
    },
    setLobbyType: (state, action) => {
      state.LobbyType = action.payload;
      if (action.payload == LobbyType.classic)
        state.params.classic = true;
      else if (action.payload == LobbyType.auto)
        state.params.classic = false;
    },
    setParams: (state, action) => {
      state.params = JSON.parse(JSON.stringify(action.payload)); 
    },
    setLobbySlots: (state, action) => {
      state.lobbySlots = JSON.parse(JSON.stringify(action.payload)); 
    },
    setGameRequests: (state, action) => {;
      state.sentInvites = [...action.payload.sent];
      state.invitedGames = [...action.payload.received];
    },
    addInvitedGame: (state, action) => {
      if (!state.invitedGames)
        state.invitedGames = [action.payload];
      else
        state.invitedGames = [...state.invitedGames, action.payload];
    },
    setParamsReceived: (state, action) => {
      state.paramsReceived = action.payload;
    },
    deleteInvitedGame: (state, action) => {
      if (!state.invitedGames)
        return ;
      let newState = [...state.invitedGames];
      let index = newState.findIndex((e) => e.lobby.id == action.payload.lobby.id && e.sender.id == action.payload.sender.id);
      newState.splice(index, index + 1);
      state.invitedGames = [...newState];
    },
    deleteInvitedGameById: (state, action) => {
      if (!state.invitedGames)
        return ;
      let newState = [...state.invitedGames];
      let index = newState.findIndex((e) => e.id == action.payload);
      newState.splice(index, index + 1);
      state.invitedGames = [...newState];
    },
    addSentInvte: (state, action) => {
      if (!state.sentInvites)
        state.sentInvites = [action.payload];
      else
        state.sentInvites = [...state.sentInvites, action.payload];
    },
    deleteSentInvite: (state, action) => {
      if (!state.sentInvites)
        return ;
      let newState = [...state.sentInvites];
      let index = newState.findIndex((e) => e.lobby.id == action.payload.lobby.id && e.receiver.id == action.payload.receiver.id);
      newState.splice(index, index + 1);
      state.sentInvites = [...newState]
    },
    setLobbyFull: (state, action) => {
      state.full = action.payload;
    },
    deleteSentInviteById: (state, action) => {
      if (!state.sentInvites)
        return ;
      let newState = [...state.sentInvites];
      let index = newState.findIndex((e) => e.id == action.payload);
      newState.splice(index, index + 1);
      state.sentInvites = [...newState]
    },
    resetLobbyData: (state) => {
      if (state.LobbyType != LobbyType.score)
        state.LobbyType = LobbyType.none;
          state.balls = [];
          state.elapsedTime = 0;
          state.full = false;
          state.isPlaying = false;
          state.lobbyId = null;
          state.lobbySlots = [];
          state.mapHeight = 0;
          state.players = [];
          state.owner = null;
          state.playersInfo = [];
          state.mapWidth = 0;
          websocketSlice.caseReducers.resetParams(state);
      //     state.params = {
      // classic: false,
      // duel: false,
        
      // map: {
      //   size: [100, 200],
      //   goalSize: 40,
      //   medianOffset: 10,
      // },
      // ball: {
      //   globalSpeed: 50, // speed
      //   reboundForce: 100, // force du rebond
      //   ballAcceleration: 10, // m / sec
      //   rotationForce: 1, // force de rotation
      // },
      // players: {
      //   speed: 120, // vitesse X et Z
      //   rotationSpeed: 50, // vitesse de rotation
      //   boostForce: 10, // force du boost
      // },
      // general: {
      //   time: 120,
      // }
      // }
       state.score = {'home': 0, 'visitor': 0};
    },
    resetParams: (state) => {
      state.params = {
        classic: false,
        duel: false,
          
        map: {
          size: [100, 200],
          goalSize: 40,
          medianOffset: 10,
        },
        ball: {
          globalSpeed: 50, // speed
          reboundForce: 100, // force du rebond
          ballAcceleration: 10, // m / sec
          rotationForce: 1, // force de rotation
        },
        players: {
          speed: 120, // vitesse X et Z
          rotationSpeed: 50, // vitesse de rotation
          boostForce: 10, // force du boost
          paddleSize: [12, 3, 2],
        },
        general: {
          time: 120,
        }
      }
    },
    setDuel: (state, action) => {
      state.params.duel = action.payload;
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
      if (!action.payload.lobbyId || action.payload.lobbyId == 0) {
        if (state.LobbyType != LobbyType.score)        
          state.LobbyType = LobbyType.none;
        state.lobbySlots = [];
        state.balls = [];
        state.players = [];
        state.owner = null;
        state.playersInfo = [];
        websocketSlice.caseReducers.resetParams(state);
        // state.params = {
        //   classic: false,
        //   duel: false,
           
        //   map: {
        //    size: [100, 200],
        //    goalSize: 40,
        //    medianOffset: 10,
        //   },
        //   ball: {
        //    globalSpeed: 50, // speed
        //    reboundForce: 100, // force du rebond
        //    ballAcceleration: 10, // m / sec
        //    rotationForce: 1, // force de rotation
        //   },
        //   players: {
        //    speed: 120, // vitesse X et Z
        //    rotationSpeed: 50, // vitesse de rotation
        //    boostForce: 10, // force du boost
        //   },
        //   general: {
        //    time: 120,
        //   }
        //  }
      }
      state.lobbyId = action.payload.lobbyId;
      state.isPlaying = action.payload.hasStarted
      state.owner = action.payload.owner;
    },
    setLobbyState: (state, action) => {
      if (!state.lobbyId)
        state.lobbyId = action.payload.lobbyId;
      if (action.payload.hasStarted && !state.isPlaying && !action.payload.hasFinished)
            state.isPlaying = true;
      if (action.payload.hasStarted && !action.payload.hasFinished) {
        state.isPlaying = true;
      }
      if (action.payload.hasFinished) {
        state.isPlaying = false;
        state.LobbyType = LobbyType.score;
        state.lastGame = {score: action.payload.score, winner: action.payload.winner, team: action.payload.team, timestamp: Date.now(), players: action.payload.players};
      }
      if (action.payload.playersInfo) {
        state.playersInfo = action.payload.playersInfo;
      }
    },
    setInLobby: (state, action) => {
      state.inLobby = action.payload;
    }
    ,
    setLobbies: (state, action) => {
      if (!action.payload)
        state.lobbies = [];
      state.lobbies = [...action.payload];
    }
  },
});

export const {setInLobby, websocketConnected, websocketDisconnected, setGameState, setAuthState, setLobbyState, setLobbyType, setParams, resetParams, setDuel, setLobbySlots, addInvitedGame, setGameRequests, deleteInvitedGame, addSentInvte, deleteSentInvite, deleteSentInviteById, deleteInvitedGameById, setLobbyFull, setLobbies, setWaitingToConnect, resetLobbyData, setParamsReceived} = websocketSlice.actions;

export default websocketSlice.reducer;
