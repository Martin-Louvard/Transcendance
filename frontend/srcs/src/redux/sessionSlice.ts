import { createSlice } from "@reduxjs/toolkit";
import { User, ChatChannels, Friendships, Friend, Message } from "../Types";
import { fetchRelatedUserData } from "./sessionThunks";
import { initNotifications } from './sessionFunctions';

// Define a type for the slice state
export interface sessionState {
  user: User | undefined;
  access_token: string | undefined;
  friends: Friend[] | undefined;
  friendships: Friendships[] | undefined;
  friendRequests: Friendships[] | undefined;
  JoinedChatChannels: ChatChannels[] | undefined;
  OwnedChatChannels: ChatChannels[] | undefined;
  BannedFromChatChannels: ChatChannels[] | undefined;
  OpenedChatChannels: ChatChannels[];
  loading: boolean;
  error: string | undefined;
  contentToShow: string;
  friendProfile: User | undefined;
}

// Define the initial state using that type
const initialState: sessionState = {
  user: undefined,
  access_token: undefined,
  friends: undefined,
  friendships: undefined,
  friendRequests: undefined,
  JoinedChatChannels: undefined,
  OwnedChatChannels: undefined,
  BannedFromChatChannels: undefined,
  OpenedChatChannels: [],
  loading: false,
  error: undefined,
  contentToShow: "friends",
  friendProfile: undefined,

};

// Utiliser createSlice permet d'ecrire les reducers comme si on mutait le state car il marche avec Immer qui sous le capot s'occupe de transformer le state de maniere immutable
export const sessionSlice = createSlice({
  name: "session",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setContentToShow: (state, action) => {
      state.contentToShow = action.payload;
    },
    setFriendProfile: (state, action) => {
      state.friendProfile = action.payload;
    },
    addOpenedChatChannel: (state, action) => {
      const chatChannel = action.payload;
      if (
        !state.OpenedChatChannels?.some(
          (channel) => channel.id === chatChannel.id,
        )
      ) {
        if (state.OpenedChatChannels?.length >= 3) {
          state.OpenedChatChannels?.shift();
        }
        state.OpenedChatChannels.push(chatChannel);
      }
    },
    addNewChatChannel: (state, action) => {
      const newChat = action.payload;
      if (
        !state.JoinedChatChannels?.some(
          (channel) => channel.id === newChat.id,
        )){
        state.JoinedChatChannels?.push(newChat);
      }
      else {
        state.JoinedChatChannels = state.JoinedChatChannels?.map((chat) => {
          if (newChat.id === chat.id){
            return newChat;
          }
          return chat;
        })
        if (state.OpenedChatChannels.filter((chat) => chat.id === newChat.id).length > 0) {
          state.OpenedChatChannels = state.OpenedChatChannels?.map((chat) => {
            if (newChat.id === chat.id){
              return newChat;
            }
            return chat;
          })
        }
      }
    },
    removeOpenedChatChannel: (state, action) => {
      const chatChannelId = action.payload;
      state.OpenedChatChannels = state.OpenedChatChannels.filter(
        (channel) => channel.id !== chatChannelId,
      );
    },
    setChatOpen: (state, action) => {
      const updatedChat = action.payload;
      state.OpenedChatChannels = state.OpenedChatChannels?.map((chat) =>
        chat.id === updatedChat.id ? { ...chat, isOpen: true } : chat
      );
      state.JoinedChatChannels = state.JoinedChatChannels?.map((chat) =>
        chat.id === updatedChat.id ? { ...chat, isOpen: true } : chat
      );
    },
    setChatClose: (state, action) => {
      const updatedChat = action.payload;
      state.OpenedChatChannels = state.OpenedChatChannels?.map((chat) =>
        chat.id === updatedChat.id ? { ...chat, isOpen: false } : chat
      );
      state.JoinedChatChannels = state.JoinedChatChannels?.map((chat) =>
        chat.id === updatedChat.id ? { ...chat, isOpen: false } : chat
      );
    },
    beenKicked: (state, action) => {
      const userKickedId = action.payload[1];
      const fromChannel = action.payload[0];

      if (state.user?.id === userKickedId){
        state.JoinedChatChannels = state.JoinedChatChannels?.filter((chann) => chann.id != fromChannel.id);
        state.OpenedChatChannels = state.OpenedChatChannels.filter((chann) => chann.id != fromChannel.id);
      }
      else {
        state.JoinedChatChannels = state.JoinedChatChannels?.map((chat) => {
          if (fromChannel.id === chat.id){
            return fromChannel;
          }
          return chat;
        })
        state.OpenedChatChannels = state.OpenedChatChannels?.map((chat) => {
          if (fromChannel.id === chat.id){
            return fromChannel;
          }
          return chat;
        })
      }
    },
    leaveChat: (state, action) => {
      const updatedChann = action.payload[0];
      if (state.user?.id === action.payload[1]){
        state.JoinedChatChannels = state.JoinedChatChannels?.filter((chann) => chann.id != updatedChann.id);
        state.OpenedChatChannels = state.OpenedChatChannels.filter((chann) => chann.id != updatedChann.id);
      }
      else {
        state.JoinedChatChannels = state.JoinedChatChannels?.map((chat) => {
          if (updatedChann.id === chat.id){
            return updatedChann;
          }
          return chat;
        })
        state.OpenedChatChannels = state.OpenedChatChannels?.map((chat) => {
          if (updatedChann.id === chat.id){
            return updatedChann;
          }
          return chat;
        })
      }
    },
    updateOneChat: (state, action) => {
      const updatedChat: ChatChannels = action.payload;
      if (!state.JoinedChatChannels?.filter(
        (chann) => chann.id === updatedChat.id).length){
        state.JoinedChatChannels?.push(updatedChat);
      }
      state.JoinedChatChannels = state.JoinedChatChannels?.map((chat) => {
        if (updatedChat.id === chat.id){
          return updatedChat;
        }
        return chat;
      })
      state.OpenedChatChannels = state.OpenedChatChannels?.map((chat) => {
        if (updatedChat.id === chat.id){
          return updatedChat;
        }
        return chat;
      })
    },
    resetNotification: (state, action) => {
      const updatedChat: ChatChannels = action.payload;
      const userId = state.user?.id;

      if (state.JoinedChatChannels !== undefined) {
        const updatedJoinedChannels: ChatChannels[] = state.JoinedChatChannels.map((chat) =>{
          if (chat.id === updatedChat.id && userId && chat.messages?.length > 0){
            const updatedMessages = chat.messages.map((message) => {
              if (
                message === chat.messages[chat.messages.length - 1] &&
                message.senderId !== userId &&
                !message.readersId?.includes(userId)
              ) {
                return {
                  ...message,
                  readersId: [...(message.readersId || []), userId],
                };
              }
              return message;
            });
            return {...chat, notifications: 0, messages: updatedMessages};
          }
          return chat;
        });
        state.JoinedChatChannels = updatedJoinedChannels;
      }
      if (state.OpenedChatChannels !== undefined) {
        const updatedJoinedChannels: ChatChannels[] = state.OpenedChatChannels.map((chat) =>{
          if (chat.id === updatedChat.id && userId){
            const updatedMessages = chat.messages.map((message) => {
              if (
                message === chat.messages[chat.messages.length - 1] &&
                message.senderId !== userId &&
                !message.readersId?.includes(userId)
              ) {
                return {
                  ...message,
                  readersId: [...(message.readersId || []), userId],
                };
              }
              return message;
            });
            return {...chat, notifications: 0, messages: updatedMessages};
          }
          return chat;
        });
        state.OpenedChatChannels = updatedJoinedChannels;
      }
    },
    updateChatNotification: (state, action) => {
      const updatedChat: ChatChannels[] = action.payload;

      updatedChat.forEach((updatedChatChannel) => {
        const openedChatIndex = state.OpenedChatChannels.findIndex(
          (chat) => chat.id === updatedChatChannel.id
        );
        const joinedChatIndex = state.JoinedChatChannels?.findIndex(
          (chat) => chat.id === updatedChatChannel.id
        );
        if (state.JoinedChatChannels !== undefined){
          if (joinedChatIndex !== -1) {
            state.JoinedChatChannels[openedChatIndex].notifications =
              updatedChatChannel.notifications;
          }
        }
        if (openedChatIndex !== -1) {
          state.OpenedChatChannels[openedChatIndex].notifications =
            updatedChatChannel.notifications;
        }
      });
    },
    setSessionUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.access_token = action.payload;
    },
    setFriends: (state, action) => {
    state.friends = action.payload;
    },
    setFriendships: (state, action) => {
      state.friendships = action.payload;
    },
    setJoinedChatChannels: (state, action) => {
      state.JoinedChatChannels = action.payload;
      setNotifications(state.JoinedChatChannels);
    },
    setOwnedChatChannels: (state, action) => {
      state.OwnedChatChannels = action.payload;
    },
    setBannedFromChatChannels: (state, action) => {
      state.BannedFromChatChannels = action.payload;
    },
    setNotifications: (state, action) => {
      const updatedChannels: ChatChannels[] = action.payload;
      const userId = state.user?.id;
      
      if (updatedChannels !== undefined) {
        state.JoinedChatChannels = updatedChannels.map((chat) => {
          const lastMessage: Message = chat.messages[chat.messages?.length - 1];
          if (lastMessage && userId) {
            let notifs = 0;
            for (let i = chat.messages.length - 1; i >= 0; i--) {
              if (
                !chat.messages[i]?.readersId?.includes(userId) &&
                chat.messages[i]?.senderId !== userId
              ) {
                notifs++;
              } else {
                break;
              }
            }
            return {...chat, notifications: notifs };
          }
          return chat;
        })
      }
    },
    receiveMessage: (state, action) => {
      const channelId = action.payload.channelId;
      const chat: ChatChannels | undefined = state.JoinedChatChannels?.find((c) => c.id === channelId);
      if (chat && chat.isOpen){
        action.payload.readersId.push(state.user?.id); 
      }
      state.JoinedChatChannels?.find((c) =>c.id == action.payload.channelId)?.messages?.push(action.payload);

      if (chat && !chat.isOpen && chat.messages?.length > 0) {
        const lastMessage: Message = chat.messages[chat.messages?.length - 1];
        const userId = state.user?.id;
        
        if (lastMessage && userId) {
          let notifs = 0;
          for (let i = chat.messages.length - 1; i >= 0; i--) {
            if (
              !chat.messages[i]?.readersId?.includes(userId) &&
              chat.messages[i]?.senderId !== userId
            ) {
              notifs++;
            } else {
              break;
            }
          }
          chat.notifications = notifs;
        }
        const updatedJoinedChannels = state.JoinedChatChannels?.map((c) =>
          c.id === channelId ? { ...chat } : c
        );
        updateChatNotification(updatedJoinedChannels);
      }
    },
    addReaderId: (state, action) => {
      const updatedMessage: Message = action.payload;
      state.JoinedChatChannels = state.JoinedChatChannels?.map((chat) => {
        if (chat.id === updatedMessage.channelId){
          chat.messages = chat.messages.map((msg) => {
            if (msg.id === updatedMessage.id)
              return  updatedMessage;
            return msg;
          });
        }
        return  chat;
      });
    },
    updateFriendRequest: (state, action) => {
      if (state.friendships === undefined || state.friendships.length === 0) {
        state.friendships = [action.payload];
      }
      else if (state.friendships.find((f) => f.id == action.payload.id)) {
        state.friendships = state.friendships.map((f) => {
            if (f.id == action.payload.id) return action.payload;
            return f;
          });
      }
      else state.friendships.push(action.payload);

      //Add to friends if friendship accepted, else filter friends and remove friends that are no longer accepted if they are in the state
      if (state.user && action.payload.status === "ACCEPTED") {
        if (state.friends === undefined || state.friends.length === 0)
          state.friends = [
            action.payload.user.id !== state.user.id
              ? action.payload.user
              : action.payload.friend,
          ];
        else
          state.friends.push(
            action.payload.user.id !== state.user.id
              ? action.payload.user
              : action.payload.friend,
          );
      } else if (
        state.friends &&
        state.user &&
        (action.payload.status === "CANCELED" ||
          action.payload.status === "DECLINED" ||
          action.payload.status === "BLOCKED")
      ) {
        state.friends = state.friends?.filter(
          (f) =>
            f.id !==
            (action.payload.user.id !== state.user?.id
              ? action.payload.user.id
              : action.payload.friend.id),
        );
      }
    },
    updateBlockStatus: (state, action) => {
      const updatedFriendShip = action.payload;
      console.log("updatedFriendShip");
      console.log(updatedFriendShip);
      if (state.friendships){
        if (state.friendships.filter((friendShip) => friendShip.id === updatedFriendShip.id).length > 0){
          state.friendships = state.friendships.map((friendShip) => {
            if (friendShip.id === updatedFriendShip.id)
              return updatedFriendShip;
            return friendShip;
          });
        }
        else {
          state.friendships.push(updatedFriendShip);
        }
      }
      else {
        state.friendships = [updatedFriendShip];
      }
    },
    updateFriendStatus: (state, action) => {
      if (state.friendships)
        state.friendships = state.friendships.map((f) => {
          if (f.friend.id === action.payload.user_id)
            f.friend.status = action.payload.status;
          else if (f.user?.id === action.payload?.user_id)
            f.user.status = action.payload.status;
          return f;
        });

      if (state.friends?.length)
        state.friends = state.friends.map((f) => {
          if (f.id === action.payload.user_id) f.status = action.payload.status;
          return f;
        });
    },
    createChat: (state, action) => {
      const newChat: ChatChannels = action.payload;
      if (state.JoinedChatChannels && newChat.participants.filter((users) => users.id === state.user!.id).length > 0)
        state.JoinedChatChannels.push(action.payload);
      else if (!state.JoinedChatChannels && newChat.participants.filter((users) => users.id === state.user!.id).length > 0)
        state.JoinedChatChannels = action.payload;
    },
    updateChat: (state, action) => {
      if ( state.JoinedChatChannels === undefined || state.JoinedChatChannels.length === 0 ) {
        if ( action.payload.friendship === undefined || action.payload.friendship.status === "ACCEPTED")
          state.JoinedChatChannels = [action.payload];
      } else {
        const updatedChannels = state.JoinedChatChannels.map((c) => {
          if (c.id === action.payload.id) c = action.payload;
          return c;
        });
        state.JoinedChatChannels = updatedChannels.filter(
          (c) =>
            c.friendship === undefined || c.friendship?.status === "ACCEPTED",
        );
      }
    },
    cleanSession: (state) => {
      (state.user = undefined),
        (state.access_token = undefined),
        (state.friends = undefined),
        (state.friendships = undefined),
        (state.JoinedChatChannels = undefined),
        (state.OwnedChatChannels = undefined),
        (state.BannedFromChatChannels = undefined),
        (state.OpenedChatChannels = []);
    },
  },
  extraReducers: (builder) => {
    fetchRelatedUserData(5);
    builder.addCase(fetchRelatedUserData.pending, (state) => {
      state.loading = true;
      state.error = undefined; });
    builder.addCase(fetchRelatedUserData.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.friends = action.payload.friends;
      state.friendships = action.payload.friendships;
      state.JoinedChatChannels = initNotifications(action.payload.JoinedChatChannels?.filter(
        (c) => !c.friendship || c.friendship.status === "ACCEPTED",
      ), state.user?.id);
      state.OwnedChatChannels = action.payload.OwnedChatChannels;
      state.BannedFromChatChannels = action.payload.BannedFromChatChannels;
    });
    builder.addCase(fetchRelatedUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
  },
});

export const {
  setContentToShow,
  setFriendProfile,
  setSessionUser,
  setToken,
  setFriends,
  setFriendships,
  setJoinedChatChannels,
  setOwnedChatChannels,
  setBannedFromChatChannels,
  cleanSession,
  receiveMessage,
  updateFriendRequest,
  updateFriendStatus,
  createChat,
  updateChat,
  addOpenedChatChannel,
  removeOpenedChatChannel,
  setChatClose,
  setChatOpen,
  resetNotification,
  updateChatNotification,
  setNotifications,
  addNewChatChannel,
  updateOneChat,
  updateBlockStatus,
  addReaderId,
  leaveChat,
  beenKicked,
} = sessionSlice.actions;
export { fetchRelatedUserData };
export default sessionSlice.reducer;
