import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import { BottomWall, LeftWall, MiddleLine, RightWall, TopWAll } from "./Walls";
import { Ball, Ground, MapData, Paddle } from "./objects";

const PongGame: React.FC = () => {
  var map: MapData = new MapData(15, 20);
  return (
    <Canvas style={{ width: "100%", height: "100%" }} shadowMap camera={{ position: [0, 10, 8], fov: 50 }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.8} position={[2.5, 5, 5]} castShadow penumbra={1} />
      <Physics>
        <Ground mapData={map}/>
        <LeftWall mapData={map}/>
        <RightWall mapData={map}/>
        <TopWAll mapData={map}/>
        <BottomWall mapData={map}/>
        <MiddleLine mapData={map}/>
        <Paddle position={[0, 0, -map.height / 2 + (map.height / 2 * 0.1)]} />
        <Paddle position={[0, 0, map.height / 2 - (map.height / 2 * 0.1)]} />
  
        <Ball />
      </Physics>
    </Canvas>
  );
};

export default PongGame;