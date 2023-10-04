import { Box, OrbitControls, PerspectiveCamera, Sphere, TrackballControls, useTexture } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree} from "@react-three/fiber";
import React, { useEffect, useRef, forwardRef, useState, useMemo, useLayoutEffect} from "react";
import { socket } from "../../socket";
import { ServerEvents, ServerPayloads, ClientEvents, ClientPayloads, Input, InputPacket, Player, LobbyType, GameParameters} from '@shared/class';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { DoubleSide, Mesh, PlaneGeometry, SphereGeometry, Vector3 } from "three";
import { InstancedBufferGeometry, Float32BufferAttribute, BufferAttribute } from 'three';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import * as THREE from 'three'
import { useKeyboardInput } from "./InputState";
import { PlayerState, usePlayerStore } from "./PlayerStore";
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
import { WebSocketState, setParams } from "/src/redux/websocketSlice";
import { Button } from "@mui/material";
import { setLobbyType } from "/src/redux/websocketSlice";
import { Ball } from "./Ball";
import { Camera } from "./Camera";
import { Goals } from "./Goals";
import { Paddle } from "./Paddle";


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

	function leaveLobby(): void {
		const payload: ClientPayloads[ClientEvents.LobbyState] = {
		  leaveLobby: true,
		  mode: null,
		  automatch: null,
		  start: false,
		}
			dispatch({
				type: 'WEBSOCKET_SEND_LOBBYSTATE',
				payload: payload,
			});
		dispatch(setLobbyType(LobbyType.none));
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
			<Canvas camera={{fov:75, position:[10, 10, 10]}} style={{ background: "#2E2E2E" }} >
				<Render game={game}/>
			</Canvas>
			<div>
				<Button onClick={() => leaveLobby()}> Surrender </Button>
			</div>
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
	const game: WebSocketState = useAppSelector(state => state.websocket);
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
	}, [KeyboardInput])


	return (
		game.balls && game.players ?
		<>
			<directionalLight position={[1, 2, 3]} intensity={1.5}/>
			<ambientLight intensity={0.5}/>
			<GrassField position={[0, 0, 0]} width={game.mapHeight} height={game.mapWidth}/>
			<Camera player={me} classic={game.params.classic} mapSize={{x: game.mapWidth, y: game.mapHeight}}/>
				{
				!game.params.classic &&
					<Goals/>
				}
			<Wall size={[game.mapWidth, 25, 2]} position={[0, 5, game.mapHeight / 2]} />
			<Wall size={[game.mapWidth, 25, 2]} position={[0, 5, -game.mapHeight / 2]}/>
			<Wall size={[2, 25, game.mapHeight]} position={[game.mapWidth / 2, 5, 0]} />
			<Wall size={[2, 25, game.mapHeight]} position={[-game.mapWidth / 2, 5, 0]} />
			<mesh>
				<boxGeometry args={[game.mapWidth, 1.5, 2]}/>
				<meshBasicMaterial color={"white"}/>
			</mesh>
			{balls}
			{players}
		</>
		: 
		<></>
	);
}
