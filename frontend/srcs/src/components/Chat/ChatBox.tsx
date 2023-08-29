import React, { useState, useEffect } from "react";
import  { ChatChannels }  from '../../Types.ts';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { removeOpenedChatChannel } from '../../redux/sessionSlice';
import Chat from './Chat';
import { getName } from './functions.ts';
import "./ChatBox.scss";

const ChatBoxes = () => {
  const currentUser = useAppSelector((state)=>state.session.user);
  const openedChannels = useAppSelector((state)=>state.session.OpenedChatChannels);
  const dispatch = useAppDispatch();
  const [minimizedChat, setMinimizedChat] = useState<number[]>([]);

  const handleToggleChatClose = (chatId : number) => {
    dispatch(removeOpenedChatChannel(chatId));
  };

  const handleMinimize = (chatId: number) => {
    if (minimizedChat?.includes(chatId))
      setMinimizedChat(minimizedChat.filter(id => id !== chatId));
    else
      setMinimizedChat([...minimizedChat, chatId]);
  };

  const box = (chat: ChatChannels) => {
    return (
      <div className={`inner-chat-boxes-wrapper ${minimizedChat.includes(chat.id) ? 'minimized' : ''}`}>
        <div className="chat-name-wrapper">
          <div className="chat-name">{getName(chat, currentUser?.username)}</div>
        <button className="minimized-box-button" onClick={() => handleMinimize(chat.id)}>
          {minimizedChat.includes(chat.id) ? "+" : "_"}
        </button>
        <img onClick={() => handleToggleChatClose(chat.id)}
          src={'cross.svg'}
          alt="Close"
          className="box-close-button"
        />
      </div>
        {!minimizedChat.includes(chat.id) && <Chat chatId={chat.id} />}
      </div>
    );
  };

  return (
    <div className="chat-boxes-wrapper">
      {openedChannels.map((chat) => (
        <div key={chat.id} className={`chat-box ${minimizedChat.includes(chat.id) ? 'minimized' : ''}`} >
          {box(chat)}
        </div>
      ))}
    </div>
  );
};

export default ChatBoxes;
