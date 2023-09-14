import { Avatar, Button, ButtonGroup, Card, CardContent, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Slider, Stack } from "@mui/material";
import { ClientEvents, ClientPayloads, LobbySlotCli, LobbySlotType, LobbyType } from "@shared/class";
import { useEffect, useLayoutEffect, useState } from "react";
import { Friend, Friendships } from "src/Types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { WebSocketState, deleteSentInvite, setLobbySlots, setLobbyType, setParams } from "../../../redux//websocketSlice";

  export const CreateMatchLobby: React.FC = (props) => {
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
						  inviteFriend(friend.friend_id == user?.id  ? friend.user :friend.friend, key)
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