import React, { useState, useEffect } from "react";
import  { ChatChannels }  from '../../Types.ts';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import './SideChatMenu.scss';

const SideChatMenu = () => {

  const currentUser = useAppSelector((state)=>state.session.user);
  const dispatch = useAppDispatch();
  const storedJoinedChannels = useAppSelector((state)=>state.session.JoinedChatChannels);
  const [chatBox, setChatBox] = useState<ChatChannels | null>(null);
  const [menuCss, setMenuCss] = useState("open-menu");
  const [fullscreen, setFullScreen] = useState(false);
  const [contentToShow, setContentToShow] = useState("menu");
  // ================================================================== //
  const userName = currentUser?.username;
  // La variable au dessus est dangereuse
  // ================================================================== //
  const toggleMenu = () => {
    setMenuCss((prevCss) =>
      prevCss.startsWith("open") ? "close-chat-menu chat-menu-transition-close" : "open-chat-menu chat-menu-transition-open"
    );
    setFullScreen((prevFullscreen) => !prevFullscreen);
  };

  const handleChatBoxClick = (chat: ChatChannels) => {
    setChatBox(chat);
  };

  function getName(chat: ChatChannels, userName: string | undefined) {
    let chatName = chat.name;
    let other = "";

    if (!chatName && chat.participants.length > 1) {
      chatName = chat.participants.filter((p) => {
        if (p.username !== userName)
          return p;
      })[0].username;
      if (chat.participants.length > 2)
        other = "and others...";
      return (`${chatName} ${other}`);
    }
    if (chat.participants.length > 1)
      return (`${userName} (You)`);
    return chatName;
  }

  const handleClick = (event: React.MouseEvent<any>) => {
    event.preventDefault();

    const targetId = event.currentTarget.id;
    if (targetId === "back") setContentToShow("menu");
  };
  
  return (
      <div className={`chat-menu-wrapper`}>
      <ul className="inner-chat-menu-wrapper">{storedJoinedChannels?.map((chat: ChatChannels) => (
        <li className={`chat-item${chatBox === chat ? "-active" : ""}`} key={chat.id}>{getName(chat, userName)}</li>
      ))}
      </ul>
    </div>
  )
} 
export default SideChatMenu;
