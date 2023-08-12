import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userReducer.ts'
import friendsReducer from './friendsReducer.tsx';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import chatChannelReducer from './chatChannelReducer.ts'


const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    friends: friendsReducer,
    chatChannels: chatChannelReducer
  },
  middleware: [thunk]
});

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
