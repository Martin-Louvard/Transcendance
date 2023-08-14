import { configureStore, combineReducers } from '@reduxjs/toolkit';import userReducer from './userSlice';
import friendsReducer from './friendsSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import createWebSocketMiddleware from './websocketMiddleware.ts';
import websocketReducer from './websocketSlice';

// Combine all reducers including persisted user reducer
const rootReducer = combineReducers({
  user: userReducer,
  friends: friendsReducer,
  websocket: websocketReducer,
});

// Persist the root reducer
const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const websocketMiddleware = createWebSocketMiddleware();
 
// Configure the store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted root reducer
  middleware: [websocketMiddleware], // Apply the WebSocket middleware,
});

// Configure listeners using the provided defaults
setupListeners(store.dispatch);
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
