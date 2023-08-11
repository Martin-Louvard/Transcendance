import React, { useEffect, useState } from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss'
import Experience from '../Game/Experience';
import { Canvas } from '@react-three/fiber';

const Dashboard: React.FC = () => {
  const [isPlaying , setIsPlaying ] = useState(false)


/*
      <div className="canvas-wrapper">
        {isPlaying ?
          <>
            <Canvas >
              <Experience/>
            </Canvas>
          </> 
          : 
          <div>
            <button className="play-button" onClick={()=>{setIsPlaying(true);}}>Play</button>
          </div>
          }
      </div>
*/

  return (<>
    
      <div className={`dashboard-wrapper`}>
        <LeftMenu />
      </div>

  </>
  );
};

export default Dashboard;