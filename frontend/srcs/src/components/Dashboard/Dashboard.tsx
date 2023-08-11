import React, { useEffect, useState } from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss'
import Experience from '../Game/Experience';
import { Canvas } from '@react-three/fiber';

const Dashboard: React.FC = () => {
  const [isPlaying , setIsPlaying ] = useState(false)
  const [fullscreen, setFullScreen] = useState(false)
  const [menuCss, setmenuCss] = useState("open-menu")

  const toggleMenu = () =>{
    if (menuCss.charAt(0) == 'o')
      setmenuCss("close-menu menu-transition-close")
    else
      setmenuCss("open-menu menu-transition-open")
    setFullScreen(!fullscreen);
  }
  
  useEffect(()=>{}, [fullscreen])

  return (<>
    
      <div className={`dashboard-wrapper ${menuCss}`}>
        <img className={`logo-nav menu-icon`} src={'/menu.svg'} onClick={toggleMenu}/>
        <LeftMenu hideMenu={fullscreen}/>
      </div>

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

  </>
  );
};

export default Dashboard;