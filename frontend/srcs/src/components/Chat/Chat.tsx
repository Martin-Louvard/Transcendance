import React from "react";
import './Chat.scss'
import Messages from "../Messages/Messages";
import MessageInput from "../Messages/MessageInput";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { User, ChatChannels, ActionOnUser } from "../../Types.ts";
import toast from 'react-hot-toast';

interface ChatProps {
  chatId: number;
}

function  isMute(chat: ChatChannels, user: User) {
  const actionOnUsers: ActionOnUser[] = chat.actionOnUser;
  if (actionOnUsers?.filter((action) => {
    if (action.user_id === user.id){
      const actionDate = new Date(action.createdAt);
      const current = new Date();
      const diff = Math.floor((current.getTime() - actionDate.getTime()) / (1000 * 60));
      if (diff <= action.time){
        toast.error(`you're muted, you have to wait: ${action.time - diff}min`)
        return action;
      }
    }
  }).length > 0) {
    return true;
  }
  return false;
}


const Chat: React.FC<ChatProps> = ({ chatId }) => {
  const user = useAppSelector((state) => state.session.user);
  const chat = useAppSelector((state) =>
    state.session.JoinedChatChannels?.find(c => c.id === chatId)
  );
  const dispatch = useAppDispatch();


  const handleSendMessage = (value: string) => {
    if (chat && user) {
      if (!isMute(chat, user))
        dispatch({
          type: 'WEBSOCKET_SEND_MESSAGE',
          payload: [chat.id, user.id, value]
        });
    }
  };

  return (
    <>
      <Messages messages={chat?.messages || []} />
      <MessageInput handleSendMessage={handleSendMessage} />
    </>
  );
};

export default Chat;
