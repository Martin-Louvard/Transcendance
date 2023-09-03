import { ChatChannels, Message } from "../../Types.ts";

export function getName(chat: ChatChannels, userName: string | undefined) {
  let chatName = chat.name;
  let other = "";

  if (!chatName && chat.participants?.length > 1) {
    chatName = chat.participants.filter((p) => {
      if (p.username !== userName) return p;
    })[0].username;
    if (chat.participants?.length > 2) other = "and others...";
    return `${chatName} ${other}`;
  }
  if (chat.participants?.length <= 1) return `${userName} (You)`;
  return chatName;
}

export function getLastMessage(chat: ChatChannels, userId: number | undefined) {
  const lastMessage: Message = chat.messages[chat.messages?.length - 1];

  if (lastMessage === undefined || userId === undefined) {
    return null;
  }
  if (lastMessage.senderId !== userId && !lastMessage.readersId?.includes(userId)) {
    return lastMessage;
  } else return null;
}
