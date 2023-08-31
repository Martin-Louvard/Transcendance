import React, { useState, useEffect } from "react";
import  { ChatChannels, Message }  from '../../Types.ts';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { addOpenedChatChannel, setChatOpen, resetNotification, setNotifications } from '../../redux/sessionSlice';  
import './SideChatMenu.scss';
import { getName } from './functions.ts';

const SideChatMenu = () => {
  const currentUser = useAppSelector((state)=>state.session.user);
  const dispatch = useAppDispatch();
  const storedJoinedChannels: ChatChannels[] | undefined = useAppSelector((state)=>state.session.JoinedChatChannels);
  const openedChannels = useAppSelector((state)=>state.session.OpenedChatChannels);
  const [chatBox, setChatBox] = useState<ChatChannels | null>(null);
  const [menuCss, setMenuCss] = useState("open-chat-menu");
  const [connected, setConnected] = useState<boolean>(false);
  // ================================================================== //
  const userName = currentUser?.username;
  // La variable au dessus est dangereuse
  // ================================================================== //
  const toggleMenu = () => {
    setMenuCss((prevCss) =>
      prevCss.startsWith("open") ? "close-chat-menu chat-menu-transition-close" : "open-chat-menu chat-menu-transition-open"
    );
  };


  const handleChatBoxClick = (chat: ChatChannels) => {
    if (!openedChannels?.some((channel: ChatChannels) => channel.id === chat.id)){
      dispatch(addOpenedChatChannel(chat));
      dispatch(setChatOpen(chat));
      dispatch(resetNotification(chat));
      dispatch({
        type: 'MSG_READ',
        payload: chat.messages[chat.messages.length - 1]
      })
    }
  };


  return (
    <div className={`chat-menu-wrapper ${menuCss}`}>
      <img className={`logo-nav chat-menu-icon`}
        src={'/menu.svg'}
        alt="Chat Menu"
        onClick={toggleMenu} />
      <ul className="inner-chat-menu-wrapper">CHATS
        <hr></hr>{storedJoinedChannels?.map((chat: ChatChannels) => (
          <li className={`chat-item${chatBox === chat ? "-active" : ""}`}
            key={chat.id}
            onClick={() => handleChatBoxClick(chat)}>
            <div className={`notification${chat.notifications > 0 ?'-some':'-none'}`}>
              {chat.notifications ? `${chat.notifications}` : ""}
            </div>
          <div>{getName(chat, userName)}</div>
          </li>
      ))}
      </ul>
    </div>
  )
} 
export default SideChatMenu;
