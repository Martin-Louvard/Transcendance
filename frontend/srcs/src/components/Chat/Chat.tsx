import React from "react";
import './Chat.scss'
import Messages from "../Messages/Messages";
import MessageInput from "../Messages/MessageInput";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

interface ChatProps {
  chatId: number;
}

const Chat: React.FC<ChatProps> = ({ chatId }) => {
  const user = useAppSelector((state) => state.session.user);
  const chat = useAppSelector((state) =>
    state.session.JoinedChatChannels?.find(c => c.id === chatId)
  );
  const dispatch = useAppDispatch();

  const handleSendMessage = (value: string) => {
    if (chat && user) {
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
