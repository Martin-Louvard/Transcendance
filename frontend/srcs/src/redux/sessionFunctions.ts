import { ChatChannels, Message } from '../Types.ts';

export function initNotifications(channels : ChatChannels[] | undefined, userId : number | undefined)
  : ChatChannels[] | undefined {
  const updatedChannels : ChatChannels[] | undefined = channels?.map((chat) => {
    const lastMessage : Message = chat.messages[chat.messages?.length - 1];
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
  });
  return updatedChannels;
}
