import React, { useState, useEffect } from "react";
import  { ChatChannel }  from './ChatChannelReducer.ts';
import { useAppSelector, useAppDispatch } from "../../hooks";
import { setUser } from '../Authentication/userReducer.ts';
import { setChatChannels } from './ChatChannelReducer.ts'
import { RootState } from '../../store.ts'
import '../Dashboard/Dashboard.css'
import io, { Socket } from "socket.io-client";
import Chat from './Chat'

const SideChatMenu = () => {

  const currentUser = useAppSelector((state)=>state.user);
  const dispatch = useAppDispatch();
  const storedJoinedChannels = useAppSelector((state: RootState)=> state.chatChannels.channels);
  const [chatBox, setChatBox] = useState<ChatChannel | null>(null);
  const [socket, setSocket] = useState<Socket>();

  useEffect(()=>{
    const newSocket=io("http://localhost:3001/");
    setSocket(newSocket)
  },[setSocket])


  useEffect(() => {
    fetch(`http://localhost:3001/chat-channels/`)
      .then((response) => {
        if (!response.ok){
          throw new Error('Erreur lors du fetch des chatChannels');
        }
        return response.json();
      })
      .then((data: ChatChannel[]) => {
        const joinedChannels = data.filter((channel) => 
          channel.participants.some((participant) => participant.id === currentUser.id));
        currentUser.JoinedChatChannels = joinedChannels;
        dispatch(setUser(currentUser));
        dispatch(setChatChannels(joinedChannels));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUser.id, dispatch]);

  const handleChatBoxClick = (chat: ChatChannel) => {
    setChatBox(chat);
  };
  
  return (
    <>
    <div>
      <ul className="side-chat-menu">{storedJoinedChannels.map((chat) => (
        <li className={`chat-item${chatBox === chat ? "-active" : ""}`} key={chat.id}>{chat.participants[0].username}</li>
      ))}
      </ul>
    </div>
  </>
  )
} 
export default SideChatMenu;
