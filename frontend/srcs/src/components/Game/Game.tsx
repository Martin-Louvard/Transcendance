import { Box, PerspectiveCamera, TrackballControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { ServerEvents, ServerPayloads, ClientEvents, ClientPayloads, Input, InputPacket, Player} from '@shared/class';
import { DoubleSide, Mesh, PlaneGeometry, SphereGeometry, Vector3 } from "three";
import { useKeyboardInput } from "./InputState";
import { PlayerState, usePlayerStore } from "./PlayerStore";
import verify from "../Authentication/verify";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { emitInput } from "./emitInput";


export const Ball: React.FC = (props) => {
	const ballRef = useRef<Mesh>(null!)

	useFrame(() => {
		ballRef.current.position.set(props.position[0], props.position[1], props.position[2]);
	  }, [])
	return (
		<mesh position={[0, 0, 0]} ref={ballRef}>
			<sphereGeometry args={props.args} />
			<meshBasicMaterial />
	  </mesh>
	)
}

interface PaddleProps {
    size: [number, number, number]; // Largeur, hauteur, profondeur
    position: [number, number, number]; // x, y, z
}

const Paddle: React.FC<PaddleProps> = ({ size, position, quaternion }) => {
    const paddleRef = useRef<Mesh>(null)!;

    useFrame(() => {
		//console.log(quaternion);
		paddleRef.current?.quaternion.copy(quaternion)
		paddleRef.current?.position.set(position[0], position[1], position[2]);
		// mise a jour en temps reel si necessaire.
		// TODO: Peut etre prevoir les directions pour eviter les latences reseaux ???
    });

    return (
		<mesh>
			<Box
				ref={paddleRef}
				args={size}
				position={[0, 0, 0]}>
				<meshPhongMaterial color="blue" />
        </Box>
		</mesh>
    ); // // TODO: Ajuste le material en fonction des données  recu. TODO: REcuperer le material en fonction des parametres de skin du player BCP plus tard. TODO... faudra les recuperer dans la db coté back.
};

const Camera: React.FC = (props) => {
	let player = props.player;
	let cameraOffset: Vector3 = new Vector3(0, 5, -15);

	if (player.team == 'visitor')
		cameraOffset.z *= -1;
	useThree(({camera}) => {
		camera.position.set(player.position[0], player.position[1], player.position[2]).add(cameraOffset);
	})
}

export const Game: React.FC = () => {
	const [data, setData] = useState<ServerPayloads[ServerEvents.GameState] | null>(null);
	const [balls, setBalls] = useState(null);
	const [players, setPlayers] = useState(null);
	const [me, setMe] = useState(null);
	const [KeyboardInput] = useKeyboardInput();
	const player = usePlayerStore();
	const navigate = useNavigate();
	const user = useAppSelector((state) => state.session.user);

	useEffect(() => {
        async function verifyToken() {
            console.log(await verify(user.access_token));
            if (!await verify(user.access_token))
                navigate('/login');
        }
        if (user && user.access_token)
            verifyToken();
        else
            navigate('/login');
		if (player && player.lobbyId == null)
			navigate('/login');
		socket.on(ServerEvents.GameState, (data: ServerPayloads[ServerEvents.GameState]) => {
			setData(data);
			//console.log(data.gameData.players[0].position);
			//console.log(data.gameData.players[1].position);
			setBalls(data.gameData.balls.map((ball, index) =>
			<Ball key={index} args={[ball.size, 32, 16]} position={ball.position}/>
			))
			setPlayers(data.gameData.players.map((player, index) =>
			<Paddle key={index} size={player.size} position={player.position} quaternion={player.quaternion}/>
			))
			data.gameData.players.map((e) => {
				if (user && e.id == user.id) {
					//console.log(`id : ${e.id} posiiton == ${e.position}`);
					setMe(e);
				}
			})
		})
	}, [])

	useEffect(() => {
		if (user)
			emitInput(KeyboardInput, user.id);
		//player.setInput(KeyboardInput);
	}, [KeyboardInput])

	//useThree(({ camera }) => {
	//	camera.position.set(me[0], me[1], me[2]);
	//})

	return (
		data ?
			<Canvas camera={{fov:75, position:[10, 10, 10]}}>
				<TrackballControls noPan noZoom/>
					<directionalLight position={[1, 2, 3]} intensity={1.5}/>
					<ambientLight intensity={0.5}/>
					<Camera player={me}/>
					{/*<PerspectiveCamera position={[-me.position[0], -20, -me.position[2] - 30]} rotation-y={me.quaternion.y} >*/}
					<mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[data.gameData.mapHeight, data.gameData.mapWidth, 1]}>
						<planeGeometry />
						<meshBasicMaterial color="green" side={DoubleSide}/>
					</mesh>
					{balls}
					{players}
				{/*</PerspectiveCamera>*/}
			</Canvas>
		: 
			<p>PAS DE JEU</p>
	);
}
