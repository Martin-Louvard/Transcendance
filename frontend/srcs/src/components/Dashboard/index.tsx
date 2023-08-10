import React, { useEffect, useState } from 'react';
import LeftMenu from './LeftMenu';
import './Dashboard.css'
import Experience from '../../Experience';
import { Canvas } from '@react-three/fiber';
import io, { Socket } from "socket.io-client";
import { useAppSelector } from '../../hooks';

const Dashboard: React.FC = () => {
  const [isPlaying , setIsPlaying ] = useState(false)
  const [fullscreen, setFullScreen] = useState(false)
  const [connectedUsersId, setConnectedUsersId] = useState([0])
  const [socket, setSocket] = useState<Socket>()
  const user = useAppSelector((state)=> state.user)

  useEffect(()=>{
    const newSocket= io("http://localhost:3001/",{extraHeaders: {user_id: user.id.toString()}});
    setSocket(newSocket)
  },[])

  const connectedUsersListener = (connected_users_id: Array<number>) =>{
    setConnectedUsersId(connected_users_id)
  }
  useEffect(()=>{
    socket?.on("connected_users", connectedUsersListener)
    return () => {socket?.off("connected_users", connectedUsersListener)}
  },[connectedUsersListener])


  useEffect(()=>{}, [fullscreen])

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
            <p>Number of connected users: {connectedUsersId.length}</p>
            <button className="play-button" onClick={()=>{setIsPlaying(true);}}>Play</button>
          </div>}
      </div>
    </div>
  </>
  );
};

export default Dashboard;