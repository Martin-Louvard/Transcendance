import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads} from '@shared/class'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useDispatch } from 'react-redux';


const AutoMatch: React.FC = () => {
  const [gameState, setGameState] = useState({isDouble: false, isDuel: false})
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (gameState.isDouble) {
      dispatch({
        type: 'WEBSOCKET_SEND_AUTOMATCH',
        payload: LobbyMode.double
      });
    } else if (gameState.isDuel) {
      dispatch({
        type: 'WEBSOCKET_SEND_AUTOMATCH',
        payload: LobbyMode.duel
      });
    }
  }, [gameState])

  useEffect(() => {
    setGameState({isDouble: false, isDuel: false});
  }, [])

    return (
        <div>
           <ButtonGroup size="large" variant="contained">
            <Button onClick={() => {setGameState({isDuel: true, isDouble: false});}}>Duel</Button>
            <Button onClick={() => {setGameState({isDuel: false, isDouble: true });}}>Double</Button>
          </ButtonGroup>
        </div>
    );
}

const MapParams: React.FC = (props) => {
  const mapParam = props.mapParam;
  const setMapParam = props.setMapParam;
  const size = props.size;
  const sliderSize = props.sliderSize;

  return (
    <Card variant="outlined" sx={{marginX: size.width / 10 / 4}}>
      <CardContent>
        <p>Map parameters: </p>
        <Stack spacing={size.width > 700 ? 16 : 2} direction={size.width > 700 ? "row" : "column"} sx={{ mb: 1, px: size.width > 1000 ? size.width / 10 / 4 : size.width > 700 ? size.width / 10 / 8 : 0} } alignItems="center">
          {/*Map Size*/}
          <Stack spacing={2} direction="column" sx={{ mt: 6, mb: 1}} alignItems="center">
            <p>Map Size </p>
            <Stack spacing={0} direction="column" sx={{ mb: 1}} alignItems="center">
                
              <Stack spacing={5} direction="row" sx={{ mt: 0, mb: 1 }} alignItems="center">
                <p>Width</p>
                <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={{
                  color: '#B45AFF',
                  width: sliderSize,
                  '& .MuiSlider-valueLabel': {
                    lineHeight: 1.2,
                    fontSize: 12,
                    background: 'unset',
                    padding: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50% 50% 50% 0',
                    backgroundColor: '#B45AFF',
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
                }}
                onChange={(_, val) => {setMapParam(prev => ({...prev, size: [val as number, prev.size[1]]}))}}/>
              </Stack>
              <Stack spacing={5} direction="row" sx={{ mt: 0, mb: 1}} alignItems="center">
                <p>Height</p>
                <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={{
                  color: '#B45AFF',
                  width: sliderSize,
                  '& .MuiSlider-valueLabel': {
                    lineHeight: 1.2,
                    fontSize: 12,
                    background: 'unset',
                    padding: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50% 50% 50% 0',
                    backgroundColor: '#B45AFF',
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
                }}
                onChange={(_, val) => {setMapParam(prev => ({...prev, size: [prev.size[0], val as number]}))}}/>
              </Stack>
            </Stack>
          </Stack>
          {/*Goal Size Size*/}
          <Stack spacing={2} direction="column" sx={{ mt: 30, mb: 1}} alignItems="center">
              <p>Goal Size</p>
              <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" max={mapParam.size[0]} min={Math.floor(mapParam.size[0] / 8)} sx={{
                color: '#B45AFF',
                width: sliderSize,
                '& .MuiSlider-valueLabel': {
                  lineHeight: 1.2,
                  fontSize: 12,
                  background: 'unset',
                  padding: 0,
                  width: 32,
                  height: 32,
                  borderRadius: '50% 50% 50% 0',
                  backgroundColor: '#B45AFF',
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
              }}
              onChange={(_, val) => {setMapParam(prev => ({...prev, goalSize: val as number}))}}/>
          </Stack>
          {/*Median Offset Size*/}
          <Stack spacing={2} direction="column" sx={{ mt: 30, mb: 1}} alignItems="center">
              <p>Median Offset</p>
              <Slider defaultValue={10} aria-label="Default" valueLabelDisplay="auto" max={40} min={0} sx={{
                color: '#B45AFF',
                width: sliderSize,
                '& .MuiSlider-valueLabel': {
                  lineHeight: 1.2,
                  fontSize: 12,
                  background: 'unset',
                  padding: 0,
                  width: 32,
                  height: 32,
                  borderRadius: '50% 50% 50% 0',
                  backgroundColor: '#B45AFF',
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
              }}
              onChange={(_, val) => {setMapParam(prev => ({...prev, medianOffset: val as number}))}}/>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

const BallParam: React.FC = (props) => {
  const ballParam = props.ballParam;
  const setBallParam = props.setBallParam;
  const sliderSize = props.sliderSize;
  const size = props.size;

  return (
    <Card>
      <p>Ball Parameters : </p>
      <CardContent>
      <Stack spacing={size.width > 700 ? 8 : 2} direction={size.width > 700 ? "row" : "column"} sx={{ mb: 1, px: size.width > 1000 ? size.width / 10 / 4 : size.width > 700 ? size.width / 10 / 8 : 0} } alignItems="center">
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1, }} alignItems="center">
            <p>Speed</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={{
              color: '#B45AFF',
              width: sliderSize,
              '& .MuiSlider-valueLabel': {
                lineHeight: 1.2,
                fontSize: 12,
                background: 'unset',
                padding: 0,
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                backgroundColor: '#B45AFF',
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
            }}
            onChange={(_, val) => {setBallParam(prev => ({...prev, globalSpeed: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Rebound Force</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={{
              color: '#B45AFF',
              width: sliderSize,
              '& .MuiSlider-valueLabel': {
                lineHeight: 1.2,
                fontSize: 12,
                background: 'unset',
                padding: 0,
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                backgroundColor: '#B45AFF',
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
            }}
            onChange={(_, val) => {setBallParam(prev => ({...prev, reboundForce: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Acceleration</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={{
              color: '#B45AFF',
              width: sliderSize,
              '& .MuiSlider-valueLabel': {
                lineHeight: 1.2,
                fontSize: 12,
                background: 'unset',
                padding: 0,
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                backgroundColor: '#B45AFF',
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
            }}
            onChange={(_, val) => {setBallParam(prev => ({...prev, ballAcceleration: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Rotation Force</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={{
              color: '#B45AFF',
              width: sliderSize,
              '& .MuiSlider-valueLabel': {
                lineHeight: 1.2,
                fontSize: 12,
                background: 'unset',
                padding: 0,
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                backgroundColor: '#B45AFF',
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
            }}
            onChange={(_, val) => {setBallParam(prev => ({...prev, rotationForce: val as number}))}}/>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

const PlayersParam: React.FC = (props) => {
  const playersParam = props.playersParam;
  const setPlayersParam = props.setPlayersParam;
  const sliderSize = props.sliderSize;
  const size = props.size;

  return (
    <Card>
      <p>Players Parameters : </p>
      <CardContent>
      <Stack spacing={size.width > 700 ? 8 : 2} direction={size.width > 700 ? "row" : "column"} sx={{ mb: 1, px: size.width > 600 ? size.width / 10 / 3: size.width > 400 ? size.width / 10 / 8 : 0} } alignItems="center">
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1, }} alignItems="center">
            <p>Speed</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={{
              color: '#B45AFF',
              width: sliderSize,
              '& .MuiSlider-valueLabel': {
                lineHeight: 1.2,
                fontSize: 12,
                background: 'unset',
                padding: 0,
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                backgroundColor: '#B45AFF',
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
            }}
            onChange={(_, val) => {setPlayersParam(prev => ({...prev, speed: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Rotation Speed</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={{
              color: '#B45AFF',
              width: sliderSize,
              '& .MuiSlider-valueLabel': {
                lineHeight: 1.2,
                fontSize: 12,
                background: 'unset',
                padding: 0,
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                backgroundColor: '#B45AFF',
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
            }}
            onChange={(_, val) => {setPlayersParam(prev => ({...prev, rotationSpeed: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Boost Force</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={{
              color: '#B45AFF',
              width: sliderSize,
              '& .MuiSlider-valueLabel': {
                lineHeight: 1.2,
                fontSize: 12,
                background: 'unset',
                padding: 0,
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                backgroundColor: '#B45AFF',
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
            }}
            onChange={(_, val) => {setPlayersParam(prev => ({...prev, boostForce: val as number}))}}/>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

const GeneralParam: React.FC = (props) => {
  const generalParam = props.generalParam;
  const setGeneralParam = props.setGeneralParam;
  const sliderSize = props.sliderSize;
  const size = props.size;
  
  return (
    <Card>
      <p>General Param</p>
      <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1, }} alignItems="center">
        <p>Time (seconds)</p>
        <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={600} min={60} sx={{
          color: '#B45AFF',
          width: 150,
          '& .MuiSlider-valueLabel': {
            lineHeight: 1.2,
            fontSize: 12,
            background: 'unset',
            padding: 0,
            width: 32,
            height: 32,
            borderRadius: '50% 50% 50% 0',
            backgroundColor: '#B45AFF',
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
        }}
        onChange={(_, val) => {setGeneralParam(prev => ({...prev, time: val as number}))}}/>
      </Stack>
    </Card>
  );
} 


export interface GameParameters {
  classic: boolean,
	duel : boolean,
	map : {
		size: [number, number], // width, height
		goalSize: number, // width
		medianOffset: number, // length
	},
	ball : {
		globalSpeed: number, // speed
		reboundForce: number, // force du rebond
		ballAcceleration: number, // m / sec
		rotationForce: number, // force de rotation
	},
	players: {
		speed: number, // vitesse X et Z
		rotationSpeed: number, // vitesse de rotation
		boostForce: number, // force du boost
	},
	general : {
		time: number, // temps d'une game en sec
	}
}

function useWindowSize() {
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


export enum LobbySlotType {
	friend = 0,
	online = 1,
	bot = 2,
}

export interface LobbySlot  {
	full: boolean;
	type: LobbySlotType;
	player: string | null;
}


const CreateMatchLobby: React.FC = (props) => {
  const size = props.size;
  const params: GameParameters = props.params;
  const [slots, setSlots] = useState<Array<LobbySlot>>( [{full: false, type: 0, player: null}, {full: false, type: 0, player: null}, {full: false, type: 0, player: null}, {full: false, type: 0, player: null}] )
  const user = useAppSelector((state) => state.session.user);

  return (
    params.duel ?
    <div style={{width: size.width, height: size.height / 2, position:"relative"}}>
      <Stack sx={{flexDirection:"row", height:150, width:250, position:"absolute", top:"50%", gap: "10px" ,left:size.width / 2 - 125}}>
          <Button variant="contained" sx={{width: 100, height: 100, flexDirection:"column"}} disabled> 
            <Avatar src={user?.avatar} alt={user?.username + " avatar"} sx={{flex:"flex: 0 0 80%", marginTop:"30px"}}/>
            <p style={{flex:"flex: 0 0 20%"}}> ME </p>
          </Button>
          {
          slots[1].type == LobbySlotType.friend ?
            <div style={{display: "flex", flexDirection:"column"}}>
              <Button variant="contained" sx={{width: 100, height: 100}} onClick={() => {
                let newSlots = [...slots];
                newSlots[1].type = LobbySlotType.online;
                setSlots(newSlots);
              }}> 
                Friends
              </Button>
              <Button sx={{alignSelf:"center", width:"auto"}}>
                Invite
              </Button>
            </div>
            :
            <Button variant="contained" sx={{width: 100, height: 100}} onClick={() => {
              let newSlots = [...slots];
              newSlots[1].type = LobbySlotType.friend;
              setSlots(newSlots);
            }}> 
              Opened to Online
            </Button>
          }
      </Stack>
    </div>
    :
    <div style={{width: size.width, height: size.height / 2, position:"relative"}}>
      <Stack sx={{flexDirection:"row", height:250, width:500, position:"absolute", top:"50%",gap:"30px", left:size.width / 2 - 250}}>
      <Button variant="contained" sx={{width: 100, height: 100, flexDirection:"column"}} disabled> 
            <Avatar  src={user?.avatar} alt={user?.username + " avatar"} sx={{ marginTop:"20px", width: 56, height: 56}}/>
            <p> ME </p>
          </Button>
          {
          slots[1].type == LobbySlotType.friend ?
            <div style={{display: "flex", flexDirection:"column"}}>
              <Button variant="contained" sx={{width: 100, height: 100}} onClick={() => {
                let newSlots = [...slots];
                newSlots[1].type = LobbySlotType.online;
                setSlots(newSlots);
              }}> 
                Friends
              </Button>
              <Button sx={{alignSelf:"center", width:"auto"}}>
                Invite
              </Button>
            </div>
            :
            <Button variant="contained" sx={{width: 100, height: 100}} onClick={() => {
              let newSlots = [...slots];
              newSlots[1].type = LobbySlotType.friend;
              setSlots(newSlots);
            }}> 
              Opened to Online
            </Button>
          }
          {
          slots[2].type == LobbySlotType.friend ?
            <div style={{display: "flex", flexDirection:"column"}}>
              <Button variant="contained" sx={{width: 100, height: 100}} onClick={() => {
                let newSlots = [...slots];
                newSlots[2].type = LobbySlotType.online;
                setSlots(newSlots);
              }}> 
                Friends
              </Button>
              <Button sx={{alignSelf:"center", width:"auto"}}>
                Invite
              </Button>
            </div>
            :
            <Button variant="contained" sx={{width: 100, height: 100}} onClick={() => {
              let newSlots = [...slots];
              newSlots[2].type = LobbySlotType.friend;
              setSlots(newSlots);
            }}> 
              Opened to Online
            </Button>
          }
          {
          slots[3].type == LobbySlotType.friend ?
            <div style={{display: "flex", flexDirection:"column"}}>
              <Button variant="contained" sx={{width: 100, height: 100}} onClick={() => {
                let newSlots = [...slots];
                newSlots[3].type = LobbySlotType.online;
                setSlots(newSlots);
              }}> 
                Friends
              </Button>
              <Button sx={{alignSelf:"center", width:"auto"}}>
                Invite
              </Button>
            </div>
            :
            <Button variant="contained" sx={{width: 100, height: 100}} onClick={() => {
              let newSlots = [...slots];
              newSlots[3].type = LobbySlotType.friend;
              setSlots(newSlots);
            }}> 
              Opened to Online
            </Button>
          }
      </Stack>
    </div>
  )
}

const CreateMatch: React.FC = () => {
  const size = useWindowSize();
  const [classic, setClassic] = useState(true);
  const [duel, setDuel] = useState(false);
  const [mapParam, setMapParam] = useState({
    size: [200, 100],
    goalSize: 20,
    medianOffset: 20,
  });
  const [ballParam, setBallParam] = useState({
    globalSpeed: 0, // speed
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
  const [params, setParams] = useState<GameParameters | null>(null);


  useEffect(() => {
    setSliderSize((size.width / 100) * 10)
  }, [size])

  function storeParams(): void {
    const params: GameParameters = {
      classic: classic,
      duel: duel,
      map: mapParam,
      players: playersParam,
      general: generalParam,
    }
    setParams(params);
  }

  return (
      !params ?
    <Card>
        <ButtonGroup size="large" variant="contained" sx={{margin: 4}}>
          <Button onClick={() => {setClassic(true)}} disabled={classic}>Basic</Button>
          <Button onClick={() => {setClassic(false)}} disabled={!classic}>Ultimate</Button>
        </ButtonGroup>
         {
         classic ?
          <Button variant="contained" sx={{
            margin: 4,
          }}
          onClick={() => {
            storeParams();
          }}> GO </Button>
        :
          <Card id="ultimate-params" sx={{ maxHeight: size.height - 200, overflow: 'auto' }}>

              <ButtonGroup size="large" variant="contained" sx={{margin:4}}>
                <Button onClick={() => {setDuel(true)}} disabled={duel} sx={{
                backgroundColor: "#B45AFF",
              }}>Duel</Button>
                <Button onClick={() => {setDuel(false)}} disabled={!duel} sx={{
                backgroundColor: "#B45AFF",
              }}>Double</Button>
              </ButtonGroup>
              <Stack spacing={2}>
                <MapParams mapParam={mapParam} setMapParam={setMapParam} size={size} sliderSize={sliderSize}/>
                <BallParam ballParam={ballParam} setBallParam={setBallParam} size={size} sliderSize={sliderSize}/>
                <PlayersParam playersParam={playersParam} setPlayersParam={setPlayersParam} size={size} sliderSize={sliderSize}/>
                <GeneralParam generalParam={generalParam} setGeneralParam={setGeneralParam}  size={size} sliderSize={sliderSize}/>
              </Stack>


              <Button variant="contained" sx={{
                margin: 4,
              }}
              onClick={() => {
                storeParams();
              }}> GO </Button>
          </Card>
          }
        </Card>
        :
            <CreateMatchLobby size={size} params={params}/>
  );
}

const JoinMatch: React.FC = () => {

  return (
    null
  );
}

export const Lobby: React.FC = () => {
  const [lobbyState, setLobbyState] = useState({isAuto: false, isCreate: false, isJoin: false});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const game = useAppSelector((state) => state.websocket);

  useEffect(() => {
      if (game.isConnected && game.isPlaying && game.lobbyId) {
        navigate('/game/' + game.lobbyId);
      }
    }, [game.lobbyId, game.isPlaying])


  function leaveLobby(): void {
    const payload: ClientPayloads[ClientEvents.LobbyState] = {
      leaveLobby: true,
      mode: null,
      automatch: null,
    }
		dispatch({
			type: 'WEBSOCKET_SEND_LOBBYSTATE',
			payload: payload,
		});
  }

  return (
    lobbyState.isAuto && !game.lobbyId ?
      <AutoMatch/>
    :
    lobbyState.isCreate && !game.lobbyId ?
      <CreateMatch/>
    :
    lobbyState.isJoin && !game.lobbyId ?
      <JoinMatch/>
    :
    !game.lobbyId && !game.isPlaying?
    <div className='play-buttons'>
       <ButtonGroup size="large" variant="contained">
        <Button className="auto-button" onClick={() => {setLobbyState({isAuto: true, isCreate: false, isJoin: false})}}>Auto Match</Button>
        <Button className="create-button" onClick={() => {setLobbyState({isAuto: false, isCreate: true, isJoin: false})}}>Create game</Button>
        <Button className="join-button" onClick={() => {setLobbyState({isAuto: false, isCreate: false, isJoin: true})}}>Join Game</Button>
      </ButtonGroup>
    </div>
    :
    game.isPlaying && game.lobbyId? 
    <div className='current-game-block'>
      <p>You are currently in a game : </p>
      <Button variant="contained" className="join-current-game" onClick={() => {navigate('/game/' + game.lobbyId)}}>Join Game</Button>
    </div>
      
    :
      <div>
        <p >Waiting for a game...</p>
        <Button variant="contained" onClick={leaveLobby}>Stop Searching</Button>
      </div>
  );
}