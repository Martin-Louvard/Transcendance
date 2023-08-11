import React, { useEffect, useState } from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss'
import Experience from '../Game/Experience';
import { Canvas } from '@react-three/fiber';

const Dashboard: React.FC = () => {
  const [isPlaying , setIsPlaying ] = useState(false)

  return (<>
    
      <div className={`dashboard-wrapper`}>
        <LeftMenu />
        <div className="canvas-wrapper">
        {isPlaying ?
          <>
            <Canvas >
              <Experience/>
            </Canvas>
          </> 
          : 
          <div>
            <button className="play-button" onClick={()=>{setIsPlaying(true);}}>PLAY</button>
          </div>
          }
      </div>
      </div>

  </>
  );
};

export default Dashboard;