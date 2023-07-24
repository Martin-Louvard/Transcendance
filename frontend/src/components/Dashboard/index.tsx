import React, { useEffect, useState } from 'react';
import LeftMenu from './LeftMenu';
import './Dashboard.css'
import Experience from '../../Experience';
import { Canvas } from '@react-three/fiber';
import ChatBoxList from '../Chat/testChat';
import MessageList from '../Chat/MessageList';
import MessageForm from '../Chat/MessageForm';

interface Chatbox {
  id: number;
  name: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
}

const Dashboard: React.FC = () => {
  const [isPlaying , setIsPlaying ] = useState(false);
  const [fullscreen, setFullScreen] = useState(false);
  const [chatboxes, setChatboxes] = useState<Chatbox[]>([]);
  const [currentChatbox, setCurrentChatbox] = useState<Chatbox | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(()=> {
    fetch('http://localhost:3001/chat-channels')
      .then((response) => response.json())
      .then((data: Chatbox[]) => setChatboxes(data))
      .catch((error) => console.error(error))
  }, []);
  const handleSelectChatbox = (chatbox: Chatbox) => {
    setCurrentChatbox(chatbox);
    fetch(`http://localhost:3001/chat-channels/${chatbox.id}/messages`)
      .then((response) => response.json())
      .then((data: Message[]) => setMessages(data))
      .catch((error) => console.error(error))
  }
  const handleSendMessage = (message: string) => {
    fetch(`http://localhost:3001/chat-channels/${currentChatbox.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ text: message }),
    })
      .then((response) => response.json())
      .then((data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      })
      .catch((error) => console.error(error))
  }

  useEffect(()=>{}, [fullscreen]);

  return (<>
    <div className="dashboard-wrapper">
      <LeftMenu hideMenu={fullscreen}/>
      <div className="canvas-wrapper">

        {isPlaying ?
        <>
        <img id={"back"} onClick={() =>{ setFullScreen(!fullscreen);}} className='fullscreen-button' src={'fullscreen.svg/'} />
        <img id={"back"} onClick={() =>{ setIsPlaying(false); setFullScreen(false)}} className='exit-button align-right' src={'cross.svg/'} />
          <Canvas >
            <Experience/>
          </Canvas>
        </> : 
        <div>
          <button className="play-button" onClick={()=>{setIsPlaying(true);}}>Play</button>
      </div>}
    </div>
    <div>
      <ChatBoxList chatboxes={chatboxes} onSelectChatbox={handleSelectChatbox} />
      {currentChatbox && (
        <div>
          <MessageList messages={messages} />
          <MessageForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
    </div>
  </>
  );
};

export default Dashboard;
