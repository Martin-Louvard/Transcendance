import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import './Chat.css'
import Messages from "../Messages/Messages";
import MessageInput from "../Messages/MessageInput";

const Chat = () => {
  const [socket, setSocket] = useState<Socket>()
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(()=>{
    const newSocket=io("http://localhost:3001/");
    setSocket(newSocket)
  },[setSocket])

  const handleSendMessage = (value: string) => {
    socket?.emit("message", value)
  };

  const messageListener = (message:string) =>{
    setMessages([...messages, message])
  }

  useEffect(()=>{
    socket?.on("message", messageListener)
    return () => {socket?.off("message", messageListener)}
  },[messageListener])

  return (
    <div className="chat-container">
      <Messages messages={messages}/>
      <MessageInput handleSendMessage={handleSendMessage}/>
    </div>
  );
};

export default Chat;