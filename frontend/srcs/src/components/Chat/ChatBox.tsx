import React, { useState, useEffect } from "react";
import  { ChatChannels }  from '../../Types.ts';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Chat from './Chat';

const ChatBox = () => {
  const currentUser = useAppSelector((state)=>state.session.user);
  const openedChannels = useAppSelector((state)=>state.session.OpenedChatChannels);
  const dispatch = useAppDispatch();
  const [displayedChannels, setDisplayedChannels] = useState<ChatChannels | null >(null);



  return (
    <div className="chat-boxes-wrapper">
    </div>
  );
}

export default ChatBox;
