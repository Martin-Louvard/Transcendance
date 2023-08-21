import React, { useState, useEffect } from "react";
import  { ChatChannels }  from '../../Types.ts';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { addOpenedChatChannel } from '../../redux/sessionSlice';  
import './SideChatMenu.scss';

const SideChatMenu = () => {

  const currentUser = useAppSelector((state)=>state.session.user);
  const dispatch = useAppDispatch();
  const storedJoinedChannels = useAppSelector((state)=>state.session.JoinedChatChannels);
  const openedChannels = useAppSelector((state)=>state.session.OpenedChatChannels);
  const [chatBox, setChatBox] = useState<ChatChannels | null>(null);
  const [menuCss, setMenuCss] = useState("open-chat-menu");
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
    if (!openedChannels?.some((channel) => channel.id === chat.id)){
      dispatch(addOpenedChatChannel(chat));
    }
  };

  function getName(chat: ChatChannels, userName: string | undefined) {
    let chatName = chat.name;
    let other = "";

    if (!chatName && chat.participants?.length > 1) {
      chatName = chat.participants.filter((p) => {
        if (p.username !== userName)
          return p;
      })[0].username;
      if (chat.participants?.length > 2)
        other = "and others...";
      return (`${chatName} ${other}`);
    }
    if (chat.participants?.length <= 1)
      return (`${userName} (You)`);
    return chatName;
  }

  return (
    <div className={`chat-menu-wrapper ${menuCss}`}>
      <img className={`logo-nav chat-menu-icon`}
        src={'/menu.svg'}
        alt="Chat Menu"
        onClick={toggleMenu} />
      <ul className="inner-chat-menu-wrapper">CHATS
        <hr></hr>{storedJoinedChannels?.map((chat: ChatChannels) => (
          <li  className={`chat-item${chatBox === chat ? "-active" : ""}`} key={chat.id} onClick={() => handleChatBoxClick(chat)}>{getName(chat, userName)}</li>
      ))}
      </ul>
    </div>
  )
} 
export default SideChatMenu;
