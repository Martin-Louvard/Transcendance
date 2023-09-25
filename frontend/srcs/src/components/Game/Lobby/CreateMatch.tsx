import { Avatar, Button, ButtonGroup, Card, CardContent, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Slider, Stack } from "@mui/material";
import { ClientEvents, ClientPayloads, GameParameters, LobbySlotCli, LobbySlotType, LobbyType } from "@shared/class";
import { useEffect, useLayoutEffect, useState } from "react";
import { Friend, Friendships } from "src/Types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { WebSocketState, deleteSentInvite, setLobbySlots, setLobbyType, setParams } from "../../../redux//websocketSlice";
import { BallParam, GeneralParam, MapParams, PlayersParam } from "./Params";
import { User } from "../../../Types";
  
  export function useWindowSize() {
	const [size, setSize] = useState({width: 0, height: 0});
	useLayoutEffect(() => {
	  function updateSize() {
		setSize({width: window.innerWidth, height: window.innerHeight});
	  }
	  window.addEventListener('resize', updateSize);
	  updateSize();
	  return () => window.removeEventListener('resize', updateSize);
	}, []);
	return size;
  }
  
  export const CreateMatch: React.FC = (props) => {
	const user = useAppSelector((state) => state.session.user);
	const game: WebSocketState = useAppSelector((state) => state.websocket);
	const dispatch = useAppDispatch();
	const size = useWindowSize();
	const [duel, setDuel] = useState(false);
	const params = useAppSelector((state) => state.websocket.params)
	const [mapParam, setMapParam] = useState({
	  size: [200, 100],
	  goalSize: 20,
	  medianOffset: 20,
	});
	const [ballParam, setBallParam] = useState({
	  globalSpeed: 10, // speed
	  reboundForce: 10, // force du rebond
	  ballAcceleration: 0.5, // m / sec
	  rotationForce: 1, // force de rotation
	})
	const [playersParam, setPlayersParam] = useState({
	  speed: 60, // vitesse X et Z
	  rotationSpeed: 10, // vitesse de rotation
	  boostForce: 10, // force du boost
	})
	const [generalParam, setGeneralParam] = useState({
	  time: 180,
	})
	const [sliderSize, setSliderSize] = useState((size.width / 100));
	console.log(sliderSize);
	const sliderStyle = {
	  width: `${sliderSize}px`,
	  '& .MuiSlider-valueLabel': {
		lineHeight: 1.2,
		fontSize: 12,
		background: 'unset',
		padding: 0,
		width: 32,
		height: 32,
		borderRadius: '50% 50% 50% 0',
		color: '#000000',
		backgroundColor: "#FFFFFF",
		transformOrigin: 'bottom left',
		transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
		'&:before': { display: 'none' },
		'&.MuiSlider-valueLabelOpen': {
		  transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
		},
		'& > *': {
		  transform: 'rotate(45deg)',
		},
	  },
	}
  
  
	useEffect(() => {
	  setSliderSize((size.width / 100) * 7)
	}, [size])
  
	function storeParams(): void {
	  const params: GameParameters = {
		classic: 'false',
		duel: duel,
		map: mapParam,
		ball: ballParam,
		players: playersParam,
		general: generalParam,
	  }
	  //setParams(params);
	  dispatch(setParams(params));
	  if (user) {
		dispatch({
		  type: 'WEBSOCKET_SEND_PARAMETERS',
		  payload: {params: params, info: {username: user.username, avatar: user.avatar, id: user.id}},
		});
		dispatch(setLobbyType(LobbyType.create));
	  }
	}

	function createLobby() {
		if (user) {
			dispatch({
			  type: 'WEBSOCKET_SEND_CREATE_LOBBY',
			  payload: {id: user.id},
			});
		  }
	}

	useEffect(() => {
		console.log("received :", params);
		setMapParam(params.map);
		setBallParam(params.ball);
		setPlayersParam(params.players);
		setGeneralParam(params.general);
		setDuel(params.duel);
	}, [game.paramsReceived])

	useEffect(() => {
		if ((game.lobbyId && game.owner == user?.username) || !game.lobbyId) {
			storeParams();
		} else if (params) {
			setMapParam(params.map);
			setBallParam(params.ball);
			setPlayersParam(params.players);
			setGeneralParam(params.general);
			setDuel(params.duel);
		} else {
			// reinitialiser
		}
	}, [duel, mapParam, ballParam, playersParam, generalParam])
  
	return (
		<Stack id="ultimate-params" sx={{backgroundColor: 'transparent',width:'100%', maxHeight: size.height - 200, overflow: 'auto', fontSize:'0.8rem',fontFamily:'avenir', display: 'flex', flexDirection:'column'}}>
			<div style={{display:'flex', flexDirection:'column', color:'white'}}>
				<p>Mode: </p>
				<ButtonGroup size="large" variant="contained" sx={{boxShadow:'0' ,margin:4, display:'flex', justifyContent:'center', color:'white'}}>
					<Button onClick={() => {setDuel(true)}} disabled={duel}>Duel</Button>
					<Button onClick={() => {setDuel(false)}} disabled={!duel}>Double</Button>
				</ButtonGroup>
			</div>
			<Stack spacing={2} sx={{boxShadow:'0', display:'flex', flexDirection:'column'}}>
				<MapParams sliderStyle={sliderStyle} mapParam={mapParam} setMapParam={setMapParam} size={size} sliderSize={sliderSize}/>
				<BallParam sliderStyle={sliderStyle} ballParam={ballParam} setBallParam={setBallParam} size={size} sliderSize={sliderSize}/>
				<PlayersParam sliderStyle={sliderStyle} playersParam={playersParam} setPlayersParam={setPlayersParam} size={size} sliderSize={sliderSize}/>
				<GeneralParam sliderStyle={sliderStyle} generalParam={generalParam} setGeneralParam={setGeneralParam}  size={size} sliderSize={sliderSize}/>
			</Stack>
				{!game.lobbyId &&
			<div style={{display:"flex", justifyContent:"center"}}>
				<Button size="small" fullWidth={false} variant="contained" sx={{
					margin: 4,
					width:"100px",
					display:'flex',
					justifyContent:'center',
					marginBottom:'100px'
				}}onClick={() => {	createLobby(); storeParams();	}}>
					GO
				</Button>
				</div>
				}
		</Stack>
	);
  }