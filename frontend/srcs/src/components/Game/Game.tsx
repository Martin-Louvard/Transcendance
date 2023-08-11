import { Box, PerspectiveCamera, TrackballControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { ServerEvents, ServerPayloads } from "./Type";
import { DoubleSide, Mesh, SphereGeometry } from "three";

export const Sphere: React.FC = (props) => {
	const meshRef = useRef<Mesh>(null!)

	useEffect(() => {
	  }, [])
	return (
		<mesh  position={props.position} ref={meshRef}>
			<sphereGeometry args={props.args} />
			<meshBasicMaterial />
	  </mesh>
	)
}

interface PaddleProps {
    size: [number, number, number]; // Largeur, hauteur, profondeur
    position: [number, number, number]; // x, y, z
}

const Paddle: React.FC<PaddleProps> = ({ size, position }) => {
    const paddleRef = useRef<Mesh>(null)!;

		console.log("icicic");
	console.log(size, position)
    useFrame(() => {
		// mise a jour en temps reel si necessaire.
		// TODO: Peut etre prevoir les directions pour eviter les latences reseaux ???
    });

    return (
        <Box
            ref={paddleRef}
            args={size}
            position={position}
        >
            <meshPhongMaterial color="blue" /> {/* Ajuste le material en fonction des données 
			recu.
			// TODO: REcuperer le material en fonction des parametres de skin du player BCP plus tard.
			// TODO... faudra les recuperer dans la db coté back.
			 */}
        </Box>
    );
};


export const Game: React.FC = () => {
	const [data, setData] = useState<ServerPayloads[ServerEvents.GameState] | null>(null);
	
	useEffect(() => {
		socket.on(ServerEvents.GameState, (data: ServerPayloads[ServerEvents.GameState]) => {
			setData(data);
		})
	}, [])
	return (
		data ?
			<Canvas>
				<TrackballControls noPan noZoom/>
					<directionalLight position={[1, 2, 3]} intensity={1.5}/>
					<ambientLight intensity={0.5}/>
					<PerspectiveCamera position={[0, 0, -100]} rotation-x={1.5}>

					{
						//TODO: GROUND: Le mettre dans un composant
					}
					<mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[data.gameData.mapHeight, data.gameData.mapWidth, 1]}>
						<planeBufferGeometry />
						<meshBasicMaterial color="green" side={DoubleSide} />
					</mesh>
					{
						data.gameData.balls.map((ball, index) => 
							<Sphere key={index} args={[ball.size, 32, 16]} position={ball.position}/>
						)
					}
					{
						data.gameData.players.map((player, index) => 
							<Paddle key={index} size={player.size} position={player.position}/>
						)
					}
					
				</PerspectiveCamera>
			</Canvas>
		: 
			null
	);
}