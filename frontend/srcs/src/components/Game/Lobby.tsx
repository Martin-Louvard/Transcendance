import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {ClientEvents, ClientPayloads, LobbyMode, LobbySlotCli, LobbySlotType, LobbyType, PlayerInfo, ServerEvents, ServerPayloads} from '@shared/class'
import {Button, ButtonGroup, Slider, Stack, Card, CardContent, Avatar, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Grid, Typography, IconButton, styled} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useDispatch } from 'react-redux';
import { Friend, Friendships, User } from 'src/Types';
import { WebSocketState, deleteInvitedGame, deleteSentInvite, resetParams, setDuel, setLobbies, setLobbySlots, setLobbyState, setLobbyType, setParams } from '../../redux/websocketSlice';
import toast from 'react-hot-toast';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { createTheme, useTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

const AutoMatch: React.FC = (props) => {
  const [gameState, setGameState] = useState({isDouble: false, isDuel: false})
  const dispatch = useAppDispatch();
  const user: User | undefined = props.user;
  const game: WebSocketState = props.game;
  const lobbyState = props.lobbyState

  useEffect(() => {
    if (gameState.isDouble && user) {
      dispatch({
        type: 'WEBSOCKET_SEND_AUTOMATCH',
        payload: {mode: LobbyMode.double, info: {username: user.username, avatar: user.avatar, id: user.id }}
      });
      dispatch(setLobbyType(LobbyType.auto));
      dispatch(setDuel(false))
    } else if (gameState.isDuel && user) {
      dispatch({
        type: 'WEBSOCKET_SEND_AUTOMATCH',
        payload:{mode: LobbyMode.duel, info: {username: user.username, avatar: user.avatar, id: user.id }},
      });
      dispatch(setLobbyType(LobbyType.auto));
      dispatch(setDuel(true));
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
  const sliderStyle =props.sliderStyle

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
                <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
                onChange={(_, val) => {setMapParam(prev => ({...prev, size: [val as number, prev.size[1]]}))}}/>
              </Stack>
              <Stack spacing={5} direction="row" sx={{ mt: 0, mb: 1}} alignItems="center">
                <p>Height</p>
                <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
                onChange={(_, val) => {setMapParam(prev => ({...prev, size: [prev.size[0], val as number]}))}}/>
              </Stack>
            </Stack>
          </Stack>
          {/*Goal Size Size*/}
          <Stack spacing={2} direction="column" sx={{ mt: 30, mb: 1}} alignItems="center">
              <p>Goal Size</p>
              <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" max={mapParam.size[0]} min={Math.floor(mapParam.size[0] / 8)} sx={sliderStyle}
              onChange={(_, val) => {setMapParam(prev => ({...prev, goalSize: val as number}))}}/>
          </Stack>
          {/*Median Offset Size*/}
          <Stack spacing={2} direction="column" sx={{ mt: 30, mb: 1}} alignItems="center">
              <p>Median Offset</p>
              <Slider defaultValue={10} aria-label="Default" valueLabelDisplay="auto" max={40} min={0} sx={sliderStyle}
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
  const sliderStyle =props.sliderStyle

  return (
    <Card>
      <p>Ball Parameters : </p>
      <CardContent>
      <Stack spacing={size.width > 700 ? 8 : 2} direction={size.width > 700 ? "row" : "column"} sx={{ mb: 1, px: size.width > 1000 ? size.width / 10 / 4 : size.width > 700 ? size.width / 10 / 8 : 0} } alignItems="center">
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1, }} alignItems="center">
            <p>Speed</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
            onChange={(_, val) => {setBallParam(prev => ({...prev, globalSpeed: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Rebound Force</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
            onChange={(_, val) => {setBallParam(prev => ({...prev, reboundForce: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Acceleration</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
            onChange={(_, val) => {setBallParam(prev => ({...prev, ballAcceleration: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Rotation Force</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
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
  const sliderStyle =props.sliderStyle

  return (
    <Card>
      <p>Players Parameters : </p>
      <CardContent>
      <Stack spacing={size.width > 700 ? 8 : 2} direction={size.width > 700 ? "row" : "column"} sx={{ mb: 1, px: size.width > 600 ? size.width / 10 / 3: size.width > 400 ? size.width / 10 / 8 : 0} } alignItems="center">
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1, }} alignItems="center">
            <p>Speed</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={150} min={10} sx={sliderStyle}
            onChange={(_, val) => {setPlayersParam(prev => ({...prev, speed: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Rotation Speed</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={100} min={10} sx={sliderStyle}
            onChange={(_, val) => {setPlayersParam(prev => ({...prev, rotationSpeed: val as number}))}}/>
          </Stack>
          <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
            <p>Boost Force</p>
            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
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
  const sliderStyle =props.sliderStyle
  
  return (
    <Card>
      <p>General Param</p>
      <Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1, }} alignItems="center">
        <p>Time (seconds)</p>
        <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={600} min={60} sx={sliderStyle}
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

const CreateMatchLobby: React.FC = (props) => {
  const size = props.size;
  const leaveLobby = props.leaveLobby
  const user = useAppSelector((state) => state.session.user);
  const game: WebSocketState = props.game;
  const [renderSlots, setRenderSlots] = useState<Element[]>(null);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const friendships = useAppSelector((state)=> state.session.friendships)
  const [acceptedFriendships, setAcceptedFriendships] = useState<Friendships[] | null>(null);
  const [invitableFriend, setInvitableFriends] = useState<Friendships[] | null>(null);
  const [indexInviteSlot, setIndexInviteSlot] = useState(-1);

    useEffect(() => {
      if (!friendships)
        return;
      setAcceptedFriendships(friendships.filter((friendship) => {
        return friendship.status === 'ACCEPTED';
      }));
      setInvitableFriends(friendships.filter((friendship) => {
        return friendship.status === 'ACCEPTED' && game.sentInvites.findIndex((invite) => 
        invite.receiver.id == (friendship.sender_id == user?.id ? friendship.user_id : friendship.sender_id)
        ) == -1 && game.lobbySlots.findIndex((slot) => 
        slot.player && slot.player.id == (friendship.sender_id == user?.id ? friendship.user_id : friendship.sender_id && slot.type == LobbySlotType.invited)
        ) == -1
      }))

    }, [friendships, game.sentInvites, game.invitedGames, game.lobbySlots])

  useEffect(() => {
    setRenderSlots( createRenderSlots() )
  }, [game.owner, game.lobbySlots, open, invitableFriend, game.sentInvites])

  useEffect(() => {
      game.lobbySlots.forEach((slot, index) => {
        if (slot.type == LobbySlotType.invited) {
          if (game.sentInvites.findIndex((invite) => 
            invite.receiver.id == slot.player?.id)
             == -1) {
              let newSlots: LobbySlotCli[] = JSON.parse(JSON.stringify(game.lobbySlots)); 
              newSlots[index].type = LobbySlotType.friend;
              newSlots[index].player = null;
              dispatch(setLobbySlots(newSlots));
            }
        }
      })
  }, [game.sentInvites])

  useEffect(() => {
    if (user && game.owner == user.username) {
      dispatch({
        type: 'WEBSOCKET_SEND_LOBBY_SLOTS',
        payload: game.lobbySlots,
      });
    }
  }, [game.lobbySlots])

  function inviteFriend(receiver: Friend, index: number) {
    if (!game.lobbyId || !user)
      return false;
    const payload: ClientPayloads[ClientEvents.GameSendRequest] = {
      senderId: user.id,
      receiverId: receiver.id,
      lobbyId: game.lobbyId,
    }
    dispatch({
			type: 'WEBSOCKET_SEND_GAME_REQUEST',
			payload: payload,
		});
    return true;
  }

  function getRequestSent(invitedId: number) {
    let req = null;
    game.sentInvites.forEach((invite) => {
      if (invite.receiver.id == invitedId) {
        req = invite;
        return ;
      }
    })
    return req;
  }

  function createRenderSlots() {
    if (!game.lobbySlots)
      return ;
    return game.lobbySlots.map((slot, index) =>
    game.params && index < (game.params.duel ? 2 : 4) ?
      slot.full && slot.player != null ?
      <div key={index}>
        {
          slot.player.username == game.owner && game.LobbyType != LobbyType.auto ?
        <img src={'/crown.svg'} width={100} height={50} style={{display: "flex", flexDirection:"column"}}/>
        : 
          <div style={{height: 55}}/>
        }
        <Button key={index} variant="contained" sx={slot.player.username != user?.username ?{width: 100, height: 100, flexDirection:"column",
        "&:disabled" : {
          backgroundColor: game.owner == slot.player.username && game.LobbyType != LobbyType.auto ? "#FFD700": "#00AC58",
          boxShadow: game.owner == slot.player.username && game.LobbyType != LobbyType.auto ? "0 0px 10px #FFD700" : null,
          color:"white",
        }
      }: {width: 100, height: 100, flexDirection:"column",
      "&:disabled" : {
        backgroundColor: game.owner == slot.player.username && game.LobbyType != LobbyType.auto ?  "#FFD700" : "#e8e8e8",
        boxShadow: game.owner == slot.player.username && game.LobbyType != LobbyType.auto ? "0 0px 10px #FFD700" : null,
        color:"black",
      }}} disabled disableElevation disableTouchRipple> 
        <Avatar  src={slot.player.avatar} alt={slot.player.username + " avatar"} sx={{ marginTop:"20px", width: 56, height: 56}}/>
        <p> {slot.player.username != user?.username ? slot.player?.username : "ME"} </p>
    </Button>
      </div>
        :
        slot.type == LobbySlotType.friend && game.LobbyType != LobbyType.auto ?
          <div  key={index} style={{display: "flex", flexDirection:"column"}}>
            <div style={{height: 55 }} />
            <Button variant="contained" sx={{width: 100, height: 100}} onClick={() => {
              if (user && game.owner != user.username)
                return ;
              let newSlots: LobbySlotCli[] = JSON.parse(JSON.stringify(game.lobbySlots)); 
              newSlots[index].type = LobbySlotType.online;
              dispatch(setLobbySlots(newSlots));
            }} disableElevation> 
              Friends
            </Button>
            <Button sx={{alignSelf:"center", width:"auto"}} onClick={() => {setOpen(true); setIndexInviteSlot(index) }}>
              Invite
            </Button>
            <Dialog open={open} onClose={() => {setOpen(false); setIndexInviteSlot(-1)}}>
            <DialogTitle>Invite friend</DialogTitle>
            <List sx={{ pt: 0 }}>              
                 {invitableFriend?.map((friend, key) => 
                    <ListItem disableGutters key={key}>
                      <ListItemButton onClick={() => {
                        if (inviteFriend(friend.friend_id == user?.id  ? friend.user :friend.friend, key)) {
                          //if (indexInviteSlot == -1)
                          //  return ;
                          //let newSlots: LobbySlotCli[] = JSON.parse(JSON.stringify(game.lobbySlots)); 
                          //newSlots[indexInviteSlot].type = LobbySlotType.invited;
                          //newSlots[indexInviteSlot].player = {username: friend.friend_id == user?.id  ? friend.user.username :friend.friend.username, avatar: friend.friend_id == user?.id  ? friend.user.avatar :friend.friend.avatar, id: friend.friend_id == user?.id  ? friend.user.id :friend.friend.id}
                          //dispatch(setLobbySlots(newSlots));
                          //toast.success(`${newSlots[indexInviteSlot].player?.username} invited`);
                          // TODO: Faire envoyer les slots depuis le back tout le temps
                        }
                        setOpen(false);
                      }}>
                      <ListItemAvatar>
                        <Avatar src={friend.friend_id == user?.id  ? friend.user.avatar :friend.friend.avatar} />
                      </ListItemAvatar>
                        <ListItemText primary={friend.friend_id == user?.id  ? friend.user.username :friend.friend.username}/>
                      </ListItemButton>
                    </ListItem>
                )}
                {/*<ListItem disableGutters>*/}
            </List>
          </Dialog>
          </div>
        :
        game.LobbyType != LobbyType.auto && slot.type == LobbySlotType.online ?
          <div key={index}>
            <div style={{height: 55}} />
            <Button key={index} variant="contained" sx={{width: 100, height: 100}} onClick={() => {
              if (user && game.owner != user.username) {
                return ;
              }
              let newSlots: LobbySlotCli[] = JSON.parse(JSON.stringify(game.lobbySlots)); 
              newSlots[index].type = LobbySlotType.friend;
              dispatch(setLobbySlots(newSlots));
            }} disableElevation> 
              Opened to Online
            </Button>
          </div>
          :
          slot.type == LobbySlotType.invited &&   game.LobbyType != LobbyType.auto  && slot.player?
          <div>
            <div style={{height: 55}}/>
            <Button key={index} variant="contained" sx={{width: 100, height: 100, flexDirection:"column"}} disabled disableElevation disableTouchRipple> 
                {/*<Avatar  src={slot.player.avatar} alt={slot.player.username + " avatar"} sx={{ marginTop:"20px", width: 56, height: 56}}/>*/}
                <p> Waiting for : {slot.player?.username }... </p>
            </Button>
            <Button sx={{alignSelf:"center", width:"auto"}} onClick={() => {
              let newSlots: LobbySlotCli[] = JSON.parse(JSON.stringify(game.lobbySlots)); 
              newSlots[index].type = LobbySlotType.friend;
              newSlots[index].player =null;
              dispatch(setLobbySlots(newSlots));
              if (!slot.player)
                return ;
              const request = getRequestSent(slot.player?.id);
              if (!request)
                return ;
              dispatch(deleteSentInvite(request));
              dispatch({
                type: "WEBSOCKET_SEND_DELETE_GAME_INVITATION",
                payload: request,
              })
            }}
            >
              Cancel
            </Button>
          </div>
          :
          <div key={index}>
            <div style={{height: 55}} />
            <Button key={index} variant="contained" sx={{width: 100, height: 100}} onClick={() => {
              if (user && game.owner != user.username) {
                return ;
              }
              let newSlots: LobbySlotCli[] = JSON.parse(JSON.stringify(game.lobbySlots)); 
              newSlots[index].type = LobbySlotType.friend;
              dispatch(setLobbySlots(newSlots));
            }} disableElevation disableTouchRipple> 
             Waiting for opponent
            </Button>
          </div>
      :
        <></>
    )
  }


  return (
    game && game.params &&
    <div style={{width: size.width, height: size.height / 2, position:"relative"}}>
        <Stack sx={game.params.duel ?{flexDirection:"row", height:250, width:500, position:"absolute", top:"50%",gap:"30px", left:size.width / 2 - 100 } : {flexDirection:"row", height:250, width:500, position:"absolute", top:"50%",gap:"30px", left:size.width / 2 - 250} }>
         {renderSlots}
      </Stack>
      {user && game.owner == user.username &&
      game.full ?
        <Button onClick={() => {
          dispatch({
            type: "WEBSOCKET_SEND_GAME_START",
          })
        }}>Start Game</Button>
        :
        <Button disabled>Start Game</Button>
      }
      <Button color='error' onClick={() => {leaveLobby()}}>Leave</Button>
    </div>
  )
}

const CreateMatch: React.FC = (props) => {
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
                <Button onClick={() => {setDuel(true)}} disabled={duel}>Duel</Button>
                <Button onClick={() => {setDuel(false)}} disabled={!duel}>Double</Button>
              </ButtonGroup>
              <Stack spacing={2}>
                <MapParams sliderStyle={sliderStyle} mapParam={mapParam} setMapParam={setMapParam} size={size} sliderSize={sliderSize}/>
                <BallParam sliderStyle={sliderStyle} ballParam={ballParam} setBallParam={setBallParam} size={size} sliderSize={sliderSize}/>
                <PlayersParam sliderStyle={sliderStyle} playersParam={playersParam} setPlayersParam={setPlayersParam} size={size} sliderSize={sliderSize}/>
                <GeneralParam sliderStyle={sliderStyle} generalParam={generalParam} setGeneralParam={setGeneralParam}  size={size} sliderSize={sliderSize}/>
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
  );
}

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));


//function getNbPlayer(slots: LobbySlotCli[]) {
//  let nb: 0;
//  slots.forEach((e) => {
//    if (e.full)
//      nb++;
//  })
//}

const JoinMatch: React.FC = () => {
  const game = useAppSelector((state) => state.websocket);
  const dispatch = useAppDispatch();
  const [renderLobbies, setRenderLobbies] = useState<Element[] | null>(null);
  const user = useAppSelector((state) => state.session.user);

  useEffect(() => {
		dispatch({
			type: 'WEBSOCKET_SEND_GET_LOBBIES',
		});
  }, [])

  function joinLobby(id: string) {
    dispatch(setLobbyType(LobbyType.create));
    dispatch({
      type: "WEBSOCKET_SEND_JOIN_LOBBY",
      payload: {lobbyId: id, info: {username: user?.username, avatar: user?.avatar, id: user?.id}},
    })

  }

  useEffect(() => {
    if (!game.lobbies)
      return ;
    setRenderLobbies(game.lobbies.map((lobby, key) => (
      <ListItem
      secondaryAction={
        <Button onClick={() => {joinLobby(lobby.id)}}>JOIN</Button>
      }
      >
        <ListItemAvatar>
          <Avatar src={lobby.creator.avatar}/>
        </ListItemAvatar>
        <ListItemText
          primary={`${lobby.creator.username}'s lobby`}
          secondary={secondary ? 'Secondary text' : ""}
          />
      </ListItem>
    )))

  }, [game.lobbies])
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  return (
    <div sx={{width:"100%"}}>
      <Grid item xs={12} md={6}  sx={{width:"50%", m:"auto"}}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Avalaible Lobbies
          </Typography>
          <Demo>
            <List dense={dense}>
              {renderLobbies}
            </List>
          </Demo>
      </Grid>
    </div>
  );
}

export const LobbyDisplayScore: React.FC = (props) => {
  const game = useAppSelector((state) => state.websocket);

  return (
    game.lastGame &&
      <div>
        <p>{game.lastGame.winner} win the game</p>
      </div>
  )
}

export const Lobby: React.FC = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const game = useAppSelector((state) => state.websocket);
  const lobbyType = useAppSelector((state) => state.websocket.LobbyType)
  const user = useAppSelector((state) => state.session.user);
  const size = useWindowSize();
  const theme = useTheme();
  console.log(theme.palette.primary.main);
  

  useEffect(() => {
      if (game.isConnected && game.isPlaying && game.lobbyId) {
        navigate('/game/' + game.lobbyId);
      }
    }, [game.lobbyId, game.isPlaying])

  function leaveLobby(): void {
    dispatch(resetParams());
    const payload: ClientPayloads[ClientEvents.LobbyState] = {
      leaveLobby: true,
      mode: null,
      automatch: null,
    }
		dispatch({
			type: 'WEBSOCKET_SEND_LOBBYSTATE',
			payload: payload,
		});
    dispatch(setLobbyType(LobbyType.none));
  }

  useEffect(() => {
    console.log(game.LobbyType);
  }, [lobbyType])

  return (
    <div>
      {
      lobbyType != LobbyType.none &&
      <Button color={'primary'} onClick={() => {dispatch(setLobbyType(LobbyType.none))}}>
        <ArrowCircleLeftIcon />
      </Button>
      }{
      !game.lobbyId && lobbyType == LobbyType.auto ?
        <AutoMatch user={user} game={game}/>
      :
      !game.lobbyId  && lobbyType == LobbyType.create?
        <CreateMatch user={user} game={game} leaveLobby={leaveLobby} setParams={setParams} size={size}/>
      :
      !game.lobbyId  && lobbyType == LobbyType.find ?
        <JoinMatch/>
      :
      !game.lobbyId && !game.isPlaying  && lobbyType == LobbyType.none?
      <div className='play-buttons'>
        <ButtonGroup size="large" variant="contained">
          <Button className="auto-button" onClick={() => {dispatch(setLobbyType(LobbyType.auto))}}>Auto Match</Button>
          <Button className="create-button" onClick={() => {dispatch(setLobbyType(LobbyType.create))}}>Create game</Button>
          <Button className="join-button" onClick={() => {dispatch(setLobbyType(LobbyType.find))}}>Join Game</Button>
        </ButtonGroup>
      </div>
      :
      game.isPlaying && game.lobbyId ? 
      <div className='current-game-block'>
        <p>You are currently in a game : </p>
        <Button variant="contained" className="join-current-game" onClick={() => {navigate('/game/' + game.lobbyId)}}>Join Game</Button>
      </div>
      :
      lobbyType != LobbyType.none && lobbyType != LobbyType.score ?
      <CreateMatchLobby game={game} size={size} leaveLobby={leaveLobby}/>
      : lobbyType == LobbyType.score &&
        <LobbyDisplayScore/>
    }
    </div>
  );
}