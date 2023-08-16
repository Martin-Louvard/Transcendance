import io, {Socket} from 'socket.io-client';
import { Middleware, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { websocketConnected, websocketDisconnected } from './websocketSlice'; // Adjust the paths
import { RootState } from './store'; // Adjust the path
import { receiveMessage, updateFriendRequest, addFriendRequest } from './sessionSlice';
const createWebSocketMiddleware = (): Middleware<{}, RootState> => (store) => {
  let socket: Socket | null = null;

  return (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    switch (action.type) {
      case 'WEBSOCKET_CONNECT':
        socket = io("http://localhost:3001/",{extraHeaders: {user_id: action.payload}}); 
        
        socket.on('connect', () => store.dispatch(websocketConnected()));
        socket.on('disconnect', () => store.dispatch(websocketDisconnected()));
        socket.on('message', (data: any) => {store.dispatch(receiveMessage(data))});
        socket.on('update_friend_request', (data: any) => {store.dispatch(updateFriendRequest(data))})
        socket.on('friend_request', (data: any) => {store.dispatch(addFriendRequest(data))});
        break;

      case 'WEBSOCKET_SEND_MESSAGE':
        if (socket && socket.connected) {
          socket.emit('message', action.payload);
        }
        break;

      case 'WEBSOCKET_SEND_FRIEND_REQUEST':
        if (socket && socket.connected) {
          socket.emit('friend_request', action.payload);
        }
        break;
  
      case 'WEBSOCKET_UPDATE_FRIEND_REQUEST':
        if (socket && socket.connected) {
          socket.emit('update_friend_request', action.payload);
        }
        break;

      default:
        return next(action);
    }
  };
};

export default createWebSocketMiddleware;
