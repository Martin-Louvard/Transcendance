import React from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss'
import { Lobby } from '../Game/Lobby';

const Dashboard: React.FC = () => {
  return (<>
    
      <div className={`dashboard-wrapper`}>
        <LeftMenu />
        <div className="canvas-wrapper">
          <Lobby/>
        </div>
      </div>

  </>
  );
};

export default Dashboard;