import React, { useRef, useEffect } from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss';
import { Lobby } from '../Game/Lobby';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import SideChatMenu from '../Chat/SideChatMenu';
import ChatBoxes from '../Chat/ChatBox';

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      if (user && user.id) {
        dispatch({ type: 'WEBSOCKET_CONNECT', payload: [user.id, user.access_token] });
      }
    }
  }, [dispatch, user]);

     
  return (
    <div className="dashboard-wrapper">
      <LeftMenu />
      <ChatBoxes />
      <SideChatMenu />
      <div className="canvas-wrapper">
        <Lobby />
      </div>
    </div>
  );
};

export default Dashboard;
