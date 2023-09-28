import io, {Socket} from 'socket.io-client';
import { Middleware, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { addInvitedGame, addSentInvte, deleteInvitedGame, deleteInvitedGameById, deleteSentInvite, deleteSentInviteById, resetLobbyData, setAuthState, setGameRequests, setGameState, setLobbies, setLobbyFull, setLobbySlots, setLobbyState, setLobbyType, setParams, setParamsReceived, setWaitingToConnect, websocketConnected, websocketDisconnected } from './websocketSlice'; // Adjust the paths
import { RootState } from './store'; // Adjust the path
import { receiveMessage, updateFriendRequest, updateFriendStatus, createChat, updateChat, addNewChatChannel, updateOneChat, updateBlockStatus, addReaderId, leaveChat, beenKicked } from './sessionSlice';
import { ClientEvents, ServerEvents, Input, InputPacket, GameRequest, ServerPayloads, LobbyType} from '@shared/class';
import { useAppSelector } from './hooks';

const createWebSocketMiddleware = (): Middleware<{}, RootState> => (store) => {

  let socket: Socket | null = null;
  return (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    switch (action.type) {
      case 'WEBSOCKET_CONNECT':
        if (!action.payload || action.payload.length == 0)
          return ;
        socket = io("http://localhost:3001/", {auth: {user_id: action.payload[0], token: action.payload[1]}, transports: ['websocket', 'polling']}); 

        socket.on('connect', () => {
          store.dispatch(setWaitingToConnect(false));
          store.dispatch(websocketConnected())
        });
        socket.on('disconnect', () => {
          store.dispatch(setWaitingToConnect(false));
          store.dispatch(websocketDisconnected())
        });
        socket.on('message', (data: any) => {store.dispatch(receiveMessage(data))});
        socket.on('friend_request', (data: any) => {store.dispatch(updateFriendRequest(data))});
        socket.on('update_friend_connection_state', (data: any) => {store.dispatch(updateFriendStatus(data))})
        socket.on('block_user', (data: any) => {store.dispatch(updateBlockStatus(data))})
        socket.on('create_chat', (data: any) => {store.dispatch(createChat(data))});
        socket.on('leave_chat', (data: any) => {store.dispatch(leaveChat(data))});
        socket.on('new_signup', (data: any) => {store.dispatch(updateOneChat(data))});
        socket.on('change_owner', (data: any) => {store.dispatch(updateOneChat(data))});
        socket.on('delete_chat', (data: any) => {store.dispatch(leaveChat(data))});
        socket.on('update_chat', (data: any) => {store.dispatch(updateOneChat(data))});
        socket.on('join_chat', (data: any) => {store.dispatch(addNewChatChannel(data))});
        socket.on('add_admin', (data: any) => {store.dispatch(updateOneChat(data))});
        socket.on('ban_user', (data: any) => {store.dispatch(beenKicked(data))});
        socket.on('unban_user', (data: any) => {store.dispatch(updateOneChat(data))});
        socket.on('mute_user', (data: any) => {store.dispatch(updateOneChat(data))});
        socket.on('add_user_chat', (data: any) => {store.dispatch(updateOneChat(data))});
        socket.on('kick_user', (data: any) => {store.dispatch(beenKicked(data))});
        socket.on('remove_admin', (data: any) => {store.dispatch(updateOneChat(data))});
        socket.on('erase_action', (data: any) => {store.dispatch(updateOneChat(data))});
        socket.on('read', (data: any) => {store.dispatch(addReaderId(data))});
        socket.on(ServerEvents.AuthState, (data: ServerPayloads[ServerEvents.AuthState]) => {
          const state = store.getState().websocket;

          if (state.lobbyId && !data.lobbyId)
            store.dispatch(resetLobbyData())
          if (data.lobbyId && state.LobbyType != LobbyType.score && state.LobbyType != LobbyType.auto && state.LobbyType != LobbyType.classic)
            store.dispatch(setLobbyType(LobbyType.wait));
          store.dispatch(setAuthState(data));
        })
        socket.on(ServerEvents.LobbyState, (data: ServerPayloads[ServerEvents.LobbyState]) => {
          if (data.hasFinished)
            store.dispatch(setLobbyType(LobbyType.score)); 
          store.dispatch(setLobbyState(data))
          if (data.hasStarted && data.lobbyId && store.getState().websocket.LobbyType == LobbyType.auto) {
            const params = store.getState().websocket.params;
            params.map.size[1] = 200;
            params.map.size[0] = 200;
            store.dispatch(setParams(params));
          }
        })
        socket.on(ServerEvents.GameState, (data: any) => {store.dispatch(setGameState(data))})
        socket.on(ServerEvents.LobbySlotsState, (data: any) => {
          store.dispatch(setLobbySlots(data))
        })
        socket.on(ServerEvents.GameRequest, (data: GameRequest) => {store.dispatch(setGameRequests(data))})
        socket.on(ServerEvents.SuccessfulInvited, (data: GameRequest) => {store.dispatch(addSentInvte(data));
          setTimeout(() => {
            store.dispatch({
              type: 'WEBSOCKET_SEND_DELETE_GAME_INVITATION',
              payload: data,
            })
          }, 60000)
        })
        socket.on(ServerEvents.DeleteSentGameRequest, (data: GameRequest) => {data && data.id && store.dispatch(deleteSentInviteById(data.id))})
        socket.on(ServerEvents.DeleteGameRequest, (data: GameRequest) => {data && data.id && store.dispatch(deleteInvitedGameById(data.id))})
        socket.on(ServerEvents.LobbyFull, (data: boolean) => {store.dispatch(setLobbyFull(data))});
        socket.on(ServerEvents.ListLobbies, (data: any) => {store.dispatch(setLobbies(data))});
        socket.on(ServerEvents.ParametersState, (data: any) => {  store.dispatch(setParamsReceived(!store.getState().websocket.paramsReceived)); store.dispatch(setParams(data))});
        break;

      case 'WEBSOCKET_SEND_MESSAGE':
        if (socket && socket.connected) {
          socket.emit('message', action.payload);
        }
        break;

      case 'WEBSOCKET_SEND_KICK_LOBBY':
        if (socket && socket.connected) {
          socket.emit(ClientEvents.KickLobby, action.payload);
        }
      break;

        case 'WEBSOCKET_SEND_LISTEN_LOBBIES':
          if (socket && socket.connected) {
            socket.emit(ClientEvents.ListenLobbies, action.payload);
          }
        break;

      case 'WEBSOCKET_SEND_GAME_START':
        if (socket && socket.connected) {
            socket.emit(ClientEvents.StartGame);
          }
          break;

      case 'NEW_SIGNUP':
      if (socket && socket.connected) {
        socket.emit('new_signup');
      }
      break;

      case 'WEBSOCKET_SEND_DELETE_GAME_INVITATION':
        if (socket && socket.connected) {
          socket.emit(ClientEvents.DeleteGameRequest, action.payload);
        }
        break;
      
      case  'WEBSOCKET_SEND_JOIN_LOBBY':
        if (socket && socket.connected) {
          socket.emit(ClientEvents.JoinLobby, action.payload);
        }
        break;

      case 'WEBSOCKET_SEND_GAME_REQUEST':
        if (socket && socket.connected) {
          socket.emit(ClientEvents.GameSendRequest, action.payload);
        }
        break;

      case 'WEBSOCKET_SEND_LOBBY_SLOTS':
        if (socket && socket.connected) {
          socket.emit(ClientEvents.LobbySlotsState, action.payload);
        }
        break;

      case 'WEBSOCKET_SEND_CREATE_LOBBY': {
        if (socket && socket.connected) {
          socket.emit(ClientEvents.CreateLobby, action.payload);
        }
        break ;
      } 

      case 'WEBSOCKET_SEND_CREATE_AND_INVITE': {
        if (socket && socket.connected) {
          socket.emit(ClientEvents.CreateAndInvite, action.payload);
        }
        break ;
      } 

      case 'WEBSOCKET_SEND_PARAMETERS':
        if (socket && socket.connected) {
          socket.emit(ClientEvents.ParameterState, action.payload);
        }
        break;
      
      case 'WEBSOCKET_SEND_AUTOMATCH':
        if (socket && socket.connected) {
          socket.emit('automatch', action.payload);
        }
        break;
      
        case 'WEBSOCKET_SEND_CLASSICAUTOMATCH':
          if (socket && socket.connected) {
            socket.emit('automatchClassic', action.payload);
          }
          break ;
      
      case 'WEBSOCKET_SEND_LOBBYSTATE':
          if (socket && socket.connected) {
            socket.emit(ClientEvents.LobbyState, action.payload);
          }
          break;

      case 'WEBSOCKET_SEND_INPUT':
        if (socket && socket.connected) {
          socket.emit(ClientEvents.InputState, action.payload);
        }
        break;

      case 'WEBSOCKET_SEND_FRIEND_REQUEST':
        if (socket && socket.connected) {
          socket.emit('friend_request', action.payload);
        }
        break;

      case 'BLOCK_USER':
        if (socket && socket.connected) {
          socket.emit('block_user', action.payload);
        }
        break;

      case 'CREATE_CHAT':
        if (socket && socket.connected) {
          socket.emit('create_chat', action.payload);
        }
        break;

      case 'JOIN_CHAT':
        if (socket && socket.connected) {
          socket.emit('join_chat', action.payload);
        }
        break;
      
      case 'CHANGE_OWNER':
        if (socket && socket.connected) {
          socket.emit('change_owner', action.payload);
        }
        break;
      
      case 'LEAVE_CHAT':
        if (socket && socket.connected) {
          socket.emit('leave_chat', action.payload);
        }
        break;

      case 'UPDATE_CHAT':
        if (socket && socket.connected) {
          socket.emit('update_chat', action.payload);
        }
        break;

        case 'MODIFY_CHAT_INFO':
          if (socket && socket.connected) {
            socket.emit('modify_chat_info', action.payload);
          }
          break;
      
      case 'UNBAN_USER':
        if (socket && socket.connected) {
          socket.emit('unban_user', action.payload);
        }
        break;

      case 'DEL_CHAT':
        if (socket && socket.connected) {
          socket.emit('delete_chat', action.payload);
        }
        break;

      case 'ADD_ADMIN':
        if (socket && socket.connected) {
          socket.emit('add_admin', action.payload);
        }
        break;

      case 'KICK_USER':
        if (socket && socket.connected) {
          socket.emit('kick_user', action.payload);
        }
        break;
      case 'ADD_USER_CHAT':
        if (socket && socket.connected) {
          socket.emit('add_user_chat', action.payload);
        }
        break;

      case 'BAN_USER':
        if (socket && socket.connected) {
          socket.emit('ban_user', action.payload);
        }
        break;

      case 'MUTE_USER':
        if (socket && socket.connected) {
          socket.emit('mute_user', action.payload);
        }
        break;

      case 'REMOVE_ADMIN':
        if (socket && socket.connected) {
          socket.emit('remove_admin', action.payload);
        }
        break;

      case 'ERASE_ACTION':
        if (socket && socket.connected) {
          socket.emit('erase_action', action.payload);
        }
        break;

      case 'MSG_READ':
        if (socket && socket.connected) {
          socket.emit('read', action.payload);
        }
        break;
      default:
        return next(action);
    }
  };
};

export default createWebSocketMiddleware;
