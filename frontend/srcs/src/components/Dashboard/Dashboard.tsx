import React, { useEffect, useState } from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss'
import { Lobby } from '../Game/Lobby';

const Dashboard: React.FC = () => {
  const [isPlaying , setIsPlaying ] = useState(false)

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