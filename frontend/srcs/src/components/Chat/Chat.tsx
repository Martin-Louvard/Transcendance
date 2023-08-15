import './Chat.scss'
import Messages from "../Messages/Messages";
import MessageInput from "../Messages/MessageInput";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

const Chat = ({chatId} : {chatId:number}) => {
  const user = useAppSelector((state)=>state.session.user)
  const chat = useAppSelector((state) => state.session.JoinedChatChannels?.find(c => c.id == chatId));
  const dispatch = useAppDispatch();

  const handleSendMessage = (value: string) => {
    dispatch({ type: 'WEBSOCKET_SEND_MESSAGE', payloads: [chat?.id, user?.id ,value] });
  };

  return (
    <div className="chat-container">
      <Messages messages={chat?.messages}/>
      <MessageInput handleSendMessage={handleSendMessage}/>
    </div>
  );
};

export default Chat;