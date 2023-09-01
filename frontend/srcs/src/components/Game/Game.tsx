import { Box, PerspectiveCamera, TrackballControls, useTexture } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree} from "@react-three/fiber";
import { useEffect, useRef, forwardRef, useState, useMemo} from "react";
import { socket } from "../../socket";
import { ServerEvents, ServerPayloads, ClientEvents, ClientPayloads, Input, InputPacket, Player} from '@shared/class';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { DoubleSide, Mesh, PlaneGeometry, SphereGeometry, Vector3 } from "three";
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import * as THREE from 'three'
import { useKeyboardInput } from "./InputState";
import { PlayerState, usePlayerStore } from "./PlayerStore";
import verify from "../Authentication/verify";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { emitInput } from "./emitInput";
import * as CANNON from 'cannon-es';
import { useControls } from 'leva'
import {HorizontalBlurEffect} from './effects/HorizontalBlur'
import {BadTVEffect} from './effects/BadTV'

export const Ball: React.FC = (props) => {
	const ballRef = useRef<Mesh>(null!)
	const colorTexture = useTexture('/ballTest.png');

	useFrame(() => {
		ballRef.current.position.set(props.position[0], props.position[1], props.position[2]);
		ballRef.current.quaternion.copy(props.quaternion);
	  }, [])
	return (
		<mesh position={[0, 0, 0]} ref={ballRef}>
			<sphereGeometry args={props.args} />
			<meshBasicMaterial color="white" side={DoubleSide} map={colorTexture}/>
	  </mesh>
	)
}

interface WallProps {
    size: [number, number, number]; 
    position: [number, number, number]; 
}

const Wall: React.FC<WallProps> = ({ size, position }) => {
    return (
        <mesh>
            <Box args={size} position={position} >
                <meshPhongMaterial color="#3f3f3f" />
            </Box>
        </mesh>
    );
};

interface PaddleProps {
    size: [number, number, number]; // Largeur, hauteur, profondeur
    position: [number, number, number]; // x, y, z
	quaternion: CANNON.Quaternion,
	team: 'visitor' | 'home' | null,
}

const Paddle: React.FC<PaddleProps> = ({ size, position, quaternion, player, key }) => {
    const paddleRef = useRef<Mesh>(null)!;

    useFrame(() => {
		//console.log(quaternion);
		paddleRef.current?.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
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
							<meshPhongMaterial color={player.team ? (player.team == 'visitor' ? "#3AFFDE" : "#FF0000") : "#45FF40" } />
        	</Box>
		</mesh>
    ); // // TODO: Ajuste le material en fonction des données  recu. TODO: REcuperer le material en fonction des parametres de skin du player BCP plus tard. TODO... faudra les recuperer dans la db coté back.
};

const Camera: React.FC = (props) => {
	let player = props.player;
	let cameraOffset: Vector3 = new Vector3(0, 5, -15);

	if (player.team == 'visitor')
		cameraOffset.z *= -1;

	const { camera } = useThree();

	useFrame(() => {
		camera.position.set(player.position[0], player.position[1], player.position[2]).add(cameraOffset);
		camera.lookAt(player.position[0], player.position[1], player.position[2]);
	})
}

function Effects() {
	// const strength = useControls("Horizontal Blur", {
	//   strength: { value: 0.1, min: 0, max: 1 }
	// })
  
	const HorizontalBlur = forwardRef(({ strength = 0 }, ref) => {
	  const effect = useMemo(() => new HorizontalBlurEffect({ strength }), [strength])
	  return <primitive ref={ref} object={effect} dispose={null} />
	})
  
	const { distortion, distortion2, speed, rollSpeed } = useControls('BadTV', {
	  distortion: { value: 0.0, min: 0, max: 50.0 },
	  distortion2: { value: 1.0, min: 0, max: 50.0 },
	  speed: { value: 0.05, min: 0, max: 5.0 },
	  rollSpeed: { value: 0, min: 0, max: 5.0 }
	})
  
	const BadTV = forwardRef(({ distortion = 3.0, distortion2 = 5.0, speed = 0.2, rollSpeed = 0.1 }, ref) => {
	  const effect = useMemo(() => new BadTVEffect({ distortion, distortion2, speed, rollSpeed }), [
		distortion,
		distortion2,
		speed,
		rollSpeed
	  ])
	  return <primitive ref={ref} object={effect} dispose={null} />
	})
	const {scene, camera, size} = useThree();
	const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])

	return (
	  <EffectComposer>
		<Bloom intensity={2} luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
		<Noise opacity={0.02} />
		{/*<BadTV distortion={distortion} distortion2={distortion2} speed={speed} rollSpeed={rollSpeed} />*/}
		{/*<HorizontalBlur strength={strength} />*/}
		{/*<AfterimagePass  attachArray="passes"  uniforms-damp-value={0.991}/>*/}

	  </EffectComposer>
	)
}

export const Game: React.FC = () => {
	const [data, setData] = useState<ServerPayloads[ServerEvents.GameState] | null>(null);
	const [balls, setBalls] = useState(null);
	const [players, setPlayers] = useState(null);
	const [me, setMe] = useState(null);
	const [KeyboardInput, prevInput] = useKeyboardInput();
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
				<Ball key={index} args={[ball.size, 32, 16]} position={ball.position} quaternion={ball.quaternion}/>
			))
			setPlayers(data.gameData.players.map((player, index) =>
				<Paddle key={index} size={player.size} position={player.position} quaternion={player.quaternion} player={player}/>
			))
			data.gameData.players.map((e) => {
				if (user && e.id == user.id) {
					setMe(e);
				}
			})
		})
	}, [])

	useEffect(() => {
		if (user)
			emitInput(KeyboardInput, prevInput, user.id);
		//player.setInput(KeyboardInput);
	}, [KeyboardInput])

	//useThree(({ camera }) => {
	//	camera.position.set(me[0], me[1], me[2]);
	//})
    function formatElapsedTime(elapsedTime: number) {
        const minutes = Math.floor(Math.round(elapsedTime) / 60);
        const seconds = Math.floor(Math.round(elapsedTime) % 60);
        return `${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`;
    }
	return (
		data ?
		<>

			<Canvas camera={{fov:75, position:[10, 10, 10]}} style={{ background: "#cfcfcf" }} >
				<TrackballControls noPan noZoom/>
					<directionalLight position={[1, 2, 3]} intensity={1.5}/>
					<ambientLight intensity={0.5}/>
					<Camera player={me}/>
					<Wall size={[data.gameData.mapHeight, 10, 2]} position={[0, 5, data.gameData.mapWidth / 2]} />
					<Wall size={[data.gameData.mapHeight, 10, 2]} position={[0, 5, -data.gameData.mapWidth / 2]}/>
					<Wall size={[2, 10, data.gameData.mapWidth]} position={[data.gameData.mapHeight / 2, 5, 0]} />
					<Wall size={[2, 10, data.gameData.mapWidth]} position={[-data.gameData.mapHeight / 2, 5, 0]} />
					<mesh>
						<boxBufferGeometry args={[data.gameData.mapHeight, 1, 2]}/>
						<meshBasicMaterial color={"#46B6FF"}/>
					</mesh>
					{/*<PerspectiveCamera position={[-me.position[0], -20, -me.position[2] - 30]} rotation-y={me.quaternion.y} >*/}
					<mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[data.gameData.mapHeight, data.gameData.mapWidth, 1]} castShadow>
						<planeGeometry />
						<meshBasicMaterial color="#2E2E2E" side={DoubleSide}/>
					</mesh>
					{balls}
					{players}
					<Effects/>
			</Canvas>
			<div id="info" style={{position:"absolute", top:"100px", left: "20px", color:"white"}}>
				<div id='score'>
					{data.gameData.score.home}
					-
					{data.gameData.score.visitor}
				</div>
				<div id='time'>
					{formatElapsedTime(data.gameData.elapsedTime)}
				</div>
			</div>
		</>
		: 
			<p>PAS DE JEU</p>
	);
}
