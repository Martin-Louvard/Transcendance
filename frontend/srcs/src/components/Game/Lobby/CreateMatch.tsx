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
	const user: User | undefined = props.user;
	const game: WebSocketState = props.game;
	const dispatch = useAppDispatch();
	const size = props.size;
	const [classic, setClassic] = useState(true);
	const [duel, setDuel] = useState(false);
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
	const [sliderSize, setSliderSize] = useState((size.width / 100) * 10);
	const sliderStyle = {
	  width: sliderSize,
	  '& .MuiSlider-valueLabel': {
		lineHeight: 1.2,
		fontSize: 12,
		background: 'unset',
		padding: 0,
		width: 32,
		height: 32,
		borderRadius: '50% 50% 50% 0',
		backgroundColor: "#90caf9",
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
	  setSliderSize((size.width / 100) * 10)
	}, [size])
  
	function storeParams(): void {
	  const params: GameParameters = {
		classic: classic,
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
  
  
	return (
	  game.LobbyType == LobbyType.create &&
	  <Card sx={{backgroundColor: 'transparent', color:'white', fontFamily:'Avenir', width:'100%', height:'100%'}}>
		<div style={{display:'flex', justifyContent:'center', bottom:100, flexDirection:'column'}}>
			<p>Type: </p>
		  <ButtonGroup size="large" variant="contained" sx={{margin: 4, display: 'flex', justifyContent:'center', flexDirection:'columns'}}>
			<Button onClick={() => {setClassic(true)}} disabled={classic}>Basic</Button>
			<Button onClick={() => {setClassic(false)}} disabled={!classic}>Ultimate</Button>
		  </ButtonGroup>
		  </div>
		   {
		   classic ?
			<Button variant="contained" sx={{
			  margin: 4,
			}}
			onClick={() => {
			  storeParams();
			}}> GO </Button>
		  :
			<Card id="ultimate-params" sx={{backgroundColor: 'transparent',width:'100%', maxHeight: size.height - 200, overflow: 'auto', fontFamily:'avenir', display: 'flex', flexDirection:'column'}}>
				<div style={{display:'flex', flexDirection:'column', color:'white'}}>
					<p>Mode: </p>
					<ButtonGroup size="large" variant="contained" sx={{margin:4, display:'flex', justifyContent:'center', color:'white'}}>
					<Button onClick={() => {setDuel(true)}} disabled={duel}>Duel</Button>
					<Button onClick={() => {setDuel(false)}} disabled={!duel}>Double</Button>
					</ButtonGroup>
				</div>
				<Stack spacing={2} sx={{display:'flex', flexDirection:'column'}}>
				  <MapParams sliderStyle={sliderStyle} mapParam={mapParam} setMapParam={setMapParam} size={size} sliderSize={sliderSize}/>
				  <BallParam sliderStyle={sliderStyle} ballParam={ballParam} setBallParam={setBallParam} size={size} sliderSize={sliderSize}/>
				  <PlayersParam sliderStyle={sliderStyle} playersParam={playersParam} setPlayersParam={setPlayersParam} size={size} sliderSize={sliderSize}/>
				  <GeneralParam sliderStyle={sliderStyle} generalParam={generalParam} setGeneralParam={setGeneralParam}  size={size} sliderSize={sliderSize}/>
				</Stack>
				<div style={{display:"flex", justifyContent:"center"}}>

					<Button size="small" fullWidth={false} variant="contained" sx={{
						margin: 4,
						width:"100px",
						display:'flex',
						justifyContent:'center',
						marginBottom:'100px'
					}}onClick={() => {	storeParams();	}}>
						GO
					</Button>
					</div>
			</Card>
			}
		  </Card>
	);
  }