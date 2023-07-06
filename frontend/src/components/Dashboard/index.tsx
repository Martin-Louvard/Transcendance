import React, { useState } from 'react';
import LeftMenu from './LeftMenu';
import './Dashboard.css'
import Experience from '../../Experience';
import { Canvas } from '@react-three/fiber';

const Dashboard: React.FC = () => {
  const [isPlaying , setIsPlaying ] = useState(false)


  const launchGame = () =>{
    setIsPlaying(true);
  }

  return (<>
    <div className="dashboard-wrapper">
      <LeftMenu/>
      <div className='canvas-wrapper'>
        {isPlaying ?
          <Canvas>
          <Experience/>
         </Canvas> : 
          <div>
            <button className="play-button" onClick={launchGame}>Play</button>
          </div>}
      </div>
    </div>
  </>
  );
};

export default Dashboard;