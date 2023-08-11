import { PerspectiveCamera, TrackballControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { ServerEvents, ServerPayloads } from "./Type";
import { Mesh, SphereGeometry } from "three";

export const Sphere: React.FC = (props) => {
	const meshRef = useRef<Mesh>(null!)
	console.log(props);

	useEffect(() => {
		console.log(Boolean(meshRef.current))
		console.log(props.position);
	  }, [])
	return (
		<mesh  position={props.position} ref={meshRef}>
			<sphereGeometry args={props.sphere} />
			<meshBasicMaterial />
	  </mesh>
	)
}

export const Game: React.FC = () => {
	const [data, setData] = useState<ServerPayloads[ServerEvents.GameState] | null>(null);

	useEffect(() => {
		socket.on(ServerEvents.GameState, (data: ServerPayloads[ServerEvents.GameState]) => {
			console.log(data);
			setData(data);
		})
	}, [])
	
	return (
		data ?
			<Canvas>
				<TrackballControls noPan noZoom/>
					<directionalLight position={[1, 2, 3]} intensity={1.5}/>
					<ambientLight intensity={0.5}/>
					<PerspectiveCamera position={[0, 0, -10]} rotation-x={1.5}>
					
					<Sphere props={[3, 32, 16]} position={data.gameData.ballPosition}/>

					
				</PerspectiveCamera>
			</Canvas>
		: 
			null
	);
}