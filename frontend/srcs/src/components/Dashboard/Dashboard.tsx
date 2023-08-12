import React from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss'
import { Lobby } from '../Game/Lobby';
import SideChatMenu from '../Chat/SideChatMenu'

const Dashboard: React.FC = () => {
  return (<>
    
      <div className={`dashboard-wrapper`}>
        <LeftMenu />
        <div className="canvas-wrapper">
          <Lobby/>
        </div>
        <SideChatMenu />
      </div>

  </>
  );
};

export default Dashboard;
