import { Box, OrbitControls, PerspectiveCamera, TrackballControls, useTexture } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree} from "@react-three/fiber";
import React, { useEffect, useRef, forwardRef, useState, useMemo, useLayoutEffect} from "react";
import { socket } from "../../socket";
import { ServerEvents, ServerPayloads, ClientEvents, ClientPayloads, Input, InputPacket, Player, LobbyType} from '@shared/class';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { DoubleSide, Mesh, PlaneGeometry, SphereGeometry, Vector3 } from "three";
import { InstancedBufferGeometry, Float32BufferAttribute, BufferAttribute } from 'three';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import * as THREE from 'three'
import { useKeyboardInput } from "./InputState";
import { PlayerState, usePlayerStore } from "./PlayerStore";
import verify from "../Authentication/verify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { emitInput } from "./emitInput";
import * as CANNON from 'cannon-es';
import { useControls } from 'leva'
import {HorizontalBlurEffect} from './effects/HorizontalBlur'
import {BadTVEffect} from './effects/BadTV'

import { GrassField } from "./GrassField";
import { useWindowSize } from "./Lobby/CreateMatch";
import { websocketConnected } from "/src/redux/websocketSlice";
import { WebSocketState } from "src/redux/websocketSlice";

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
                <meshPhongMaterial color="#2E2E2E"  />
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

const Paddle: React.FC<PaddleProps> = ({ size, position, quaternion, player }) => {
    const paddleRef = useRef<Mesh>(null)!;

    useFrame(() => {
		paddleRef.current?.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
		paddleRef.current?.position.set(position[0], position[1], position[2]);
		// mise a jour en temps reel si necessaire.
		// TODO: Peut etre prevoir les directions pour eviter les latences reseaux ???
    });

    return (
		<mesh >
			<Box
				ref={paddleRef}
				args={size}
				position={[0, 0, 0]}>
							<meshPhongMaterial color={player.team ? (player.team == 'visitor' ? "#0042ff" : "#FF0000") : "#45FF40" } />
        	</Box>
		</mesh>
    ); // // TODO: Ajuste le material en fonction des données  recu. TODO: REcuperer le material en fonction des parametres de skin du player BCP plus tard. TODO... faudra les recuperer dans la db coté back.
};

const Camera: React.FC = (props) => {
	let player = props.player;
	let cameraOffset: Vector3 = new Vector3(0, 3, -10);
	let classic: boolean = props.classic;

	if (player && player.team == 'visitor')
		cameraOffset.z *= -1;

	const { camera } = useThree();
	let camRotationStart: THREE.Euler | null = null;

	useEffect(() => {
		camRotationStart = camera.rotation.clone();
	}, [])

	useFrame(() => {
		if (!player)
			return ;
		if (classic) {
			camera.position.set(0, 150, 0)
			camera.lookAt(0,0, 0);
			if (player.team == 'home')
				camera.rotation.z = Math.PI;
		} else {
			camera.position.set(player.position[0], player.position[1], player.position[2]).add(cameraOffset);
			camera.lookAt(player.position[0], player.position[1], player.position[2]);
		}
		if (camRotationStart)
			camera.rotation.set(camRotationStart.x, camRotationStart.y, camRotationStart.z);
	}, [])
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
		{/*<Bloom intensity={0.1} luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />*/}
		<Noise opacity={0.02} />
		{/*<BadTV distortion={distortion} distortion2={distortion2} speed={speed} rollSpeed={rollSpeed} />*/}
		{/*<HorizontalBlur strength={strength} />*/}
		{/*<AfterimagePass  attachArray="passes"  uniforms-damp-value={0.991}/>*/}

	  </EffectComposer>
	)
}

export const Game: React.FC = () => {
	const game = useAppSelector((state) => state.websocket);
	const navigate = useNavigate();
	const size = useWindowSize();
	const dispatch = useAppDispatch();

    function formatElapsedTime(elapsedTime: number) {
        const minutes = Math.floor(Math.round(elapsedTime) / 60);
        const seconds = Math.floor(Math.round(elapsedTime) % 60);
        return `${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`;
    }
	useEffect(() => {
		if (!game.isConnected || !game.isPlaying)
			navigate('/');

	}, [game])

	return (
		game.score?
		<>
			<div id="info" style={{position:"absolute", top:"50px", left:(size.width / 2).toString() + "px", zIndex:10000, width:"100px" , color:"white", backgroundColor:"black"}}>
				<div id='score'>
					{game.score.home}
					-
					{game.score.visitor}
				</div>
				<div id='time'>
					{formatElapsedTime(game.elapsedTime)}
				</div>
			</div>
			<Canvas camera={{fov:75, position:[10, 10, 10]}} style={{ background: "#cfcfcf" }} >
				<Render game={game}/>
			</Canvas>
		</>
		: 
		<></>
	)
}

export const Render: React.FC = (props) => {
	const [balls, setBalls] = useState(null);
	const [players, setPlayers] = useState(null);
	const [me, setMe] = useState(null);
	const [KeyboardInput, prevInput] = useKeyboardInput();
	const user = useAppSelector((state) => state.session.user);
	const game: WebSocketState = props.game;
	const dispatch = useAppDispatch();


	useEffect(() => {
		setBalls(game.balls.map((ball, index) =>
			<Ball key={index} args={[ball.size, 32, 16]} position={ball.position} quaternion={ball.quaternion}/>
		))
		setPlayers(game.players.map((player, index) =>
			<Paddle key={index} size={player.size} position={player.position} quaternion={player.quaternion} player={player}/>
		))
		game.players.map((e) => {
			if (user && e.id == user.id) {
				setMe(e);
			}
		})
	}, [game])



	function emitInput(KeyboardInput: Input, prevInput: Input, id: number) {
	
	// PRESSED
	if (KeyboardInput.up) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 0;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (KeyboardInput.right) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 1;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (KeyboardInput.down) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 2;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (KeyboardInput.left) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 3;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (KeyboardInput.boost) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 4;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (KeyboardInput.rotRight) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 5;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});	
	}
	if (KeyboardInput.rotLeft) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 6;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: true,
			id: id,
		}	
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}

	// RELEASED
	if (!KeyboardInput.up && prevInput.up) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 0;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (!KeyboardInput.right && prevInput.right) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 1;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (!KeyboardInput.down && prevInput.down) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 2;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (!KeyboardInput.left && prevInput.left) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 3;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (!KeyboardInput.boost  && prevInput.boost) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 4;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});
	}
	if (!KeyboardInput.rotRight && prevInput.rotRight) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 5;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});	
	}
	if (!KeyboardInput.rotLeft  && prevInput.rotLeft) {
		const timestamp: number = Math.floor(Date.now() / 1000);
		const code = 6;
		const payload: InputPacket = {
			code: code,
			timestamp: timestamp,
			pressed: false,
			id: id,
		}
		dispatch({
			type: 'WEBSOCKET_SEND_INPUT',
			payload: payload,
		});	
	}
} 

	useEffect(() => {
		if (user)
			emitInput(KeyboardInput, prevInput, user.id);
		//player.setInput(KeyboardInput);
	}, [KeyboardInput])


	//useThree(({ camera }) => {
	//	camera.position.set(me[0], me[1], me[2]);
	//})

	return (
		game.balls && game.players ?
		<>

				<TrackballControls noPan noZoom/>
				<OrbitControls/>
					<directionalLight position={[1, 2, 3]} intensity={1.5}/>
					<ambientLight intensity={0.5}/>
					<GrassField position={[0, 0, 0]} width={game.mapHeight} height={game.mapWidth}/>
					<Camera player={me} classic={game.params.classic}/>
					<Wall size={[game.mapWidth, 10, 2]} position={[0, 5, game.mapHeight / 2]} />
					<Wall size={[game.mapWidth, 10, 2]} position={[0, 5, -game.mapHeight / 2]}/>
					<Wall size={[2, 10, game.mapHeight]} position={[game.mapWidth / 2, 5, 0]} />
					<Wall size={[2, 10, game.mapHeight]} position={[-game.mapWidth / 2, 5, 0]} />
					<mesh>
						<boxBufferGeometry args={[game.mapWidth, 1.5, 2]}/>
						<meshBasicMaterial color={"white"}/>
					</mesh>
					{balls}
					{players}
					{/*<Effects/>*/}
		</>
		: 
		<></>
			//<p>PAS DE JEU</p>
	);
}
