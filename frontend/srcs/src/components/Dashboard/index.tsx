import React, { useEffect, useState } from 'react';
import LeftMenu from './LeftMenu';
import './Dashboard.css'
import Experience from '../../Experience';
import { Canvas } from '@react-three/fiber';
import SideChatMenu from '../Chat/SideChatMenu';

const Dashboard: React.FC = () => {
  const [isPlaying , setIsPlaying ] = useState(false)
  const [fullscreen, setFullScreen] = useState(false)

  
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
            <button className="play-button" onClick={()=>{setIsPlaying(true);}}>Play</button>
          </div>}
        </div>
        <SideChatMenu />
    </div>
  </>
  );
};

export default Dashboard; 
