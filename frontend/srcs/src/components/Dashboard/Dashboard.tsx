import React, { useEffect, useState } from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss'
import { Lobby } from '../Game/Lobby';
import { useAppSelector } from '../../redux/hooks';
import io, { Socket } from "socket.io-client";

const Dashboard: React.FC = () => {
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

  return (<>
    
      <div className={`dashboard-wrapper`}>
        <LeftMenu />
        <div className="canvas-wrapper">
          <p>Number of connected users: {connectedUsersId.length}</p>
          <Lobby/>
        </div>
      </div>

  </>
  );
};

export default Dashboard;