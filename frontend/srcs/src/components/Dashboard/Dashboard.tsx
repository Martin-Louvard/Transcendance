import React, { useRef, useEffect } from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss';
import { Lobby } from '../Game/Lobby/Lobby';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import SideChatMenu from '../Chat/SideChatMenu';
import ChatBoxes from '../Chat/ChatBox';

const Dashboard: React.FC = () => {

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
