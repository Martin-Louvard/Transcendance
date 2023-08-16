import React, { useState, useEffect } from "react";
import  { chatChannel }  from '../../redux/chatChannelReducer.ts';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setUser } from '../../redux/userReducer.ts';
import { setChatChannels } from '../../redux/chatChannelReducer.ts'
import { RootState } from '../../redux/store.ts'
import io, { Socket } from "socket.io-client";
import Chat from './Chat'

const SideChatMenu = () => {

  const currentUser = useAppSelector((state)=>state.user);
  const dispatch = useAppDispatch();
  const storedJoinedChannels = useAppSelector((state: RootState)=> state.chatChannels.channels);
  const [chatBox, setChatBox] = useState<chatChannel | null>(null);
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
      .then((data: chatChannel[]) => {
        const joinedChannels = data.filter((channel) => 
          channel.participants.some((participant) => participant.id === currentUser.id));
        dispatch(setChatChannels(joinedChannels));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUser.id, dispatch]);

  const handleChatBoxClick = (chat: chatChannel) => {
    setChatBox(chat);
  };
  
  return (
    <>
    <div>
      <ul className="side-chat-menu">{storedJoinedChannels.map((chat: chatChannel) => (
        <li className={`chat-item${chatBox === chat ? "-active" : ""}`} key={chat.id}>{chat.participants[0].username}</li>
      ))}
      </ul>
    </div>
  </>
  )
} 
export default SideChatMenu;
