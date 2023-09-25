import { Avatar, Button, ButtonGroup, Card, CardContent, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Slider, Stack } from "@mui/material";
import { ClientEvents, ClientPayloads, LobbySlotCli, LobbySlotType, LobbyType } from "@shared/class";
import { useEffect, useLayoutEffect, useState } from "react";
import { Friend, Friendships, Status } from "/src/Types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { WebSocketState, deleteSentInvite, setLobbySlots, setLobbyType, setParams } from "../../../redux/websocketSlice";
import LoopIcon from '@mui/icons-material/Loop';
import './Lobby.scss'
import { CreateMatch } from "./CreateMatch";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import toast from "react-hot-toast";
import LogoutIcon from '@mui/icons-material/Logout';

  export const CreateMatchLobby: React.FC = (props) => {
	const size = props.size;
	const leaveLobby = props.leaveLobby;
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
		slot.player && slot.player.id == (friendship.sender_id == user?.id ? friendship.user_id : friendship.sender_id)
		) == -1
	}))
	}, [friendships, game.sentInvites, game.invitedGames, game.lobbySlots])
  
	useEffect(() => {
	  setRenderSlots( createRenderSlots() )
	}, [game.owner, game.lobbySlots, open, invitableFriend, game.sentInvites, game.LobbyType])
  
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

	function createRenderSlots() {
		if (!game.lobbySlots)
		  return;
	  
		return (
		  game.lobbySlots.map((slot, index) => (
			renderPlayerSlot(slot, index)
		  ))
		);
	  }
  
	function renderPlayerSlot(slot, index) {
		return (
		<div key={index} style={{height:'130px'}}>
			{game.params ?
			slot.full && slot.player != null ?
				renderFilledSlot(slot, index) :
				renderEmptySlot(slot, index)
			:
			<></>
			}
		</div>
		);
	  }

	  function isFriend(id) {
		if (user?.id == id)
			return true;
		if (friendships?.find(f => f.status === "ACCEPTED" && (id == f.user_id || id == f.friend_id)))
			return true;
		if (friendships?.find((fs) =>( (fs.user_id == id || fs.friend_id == id) && (fs.status == "ACCEPTED" || fs.status == "PENDING"))))
			return true;
		return false;
	  }

	  function addFriend(username) {
		dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [user?.id, username]})
		toast.success("Request Sent")
	  }

	  function handleKick(id) {
		dispatch({ type: 'WEBSOCKET_SEND_KICK_LOBBY', payload: id})
	  }
	  
	  function renderFilledSlot(slot: LobbySlotCli, index) {
		return (
		  <div>
			{slot.player.username == game.owner && game.LobbyType != LobbyType.auto && game.LobbyType != LobbyType.classic?
			  <img src={'/crown.svg'} width={100} height={50} style={{ display: "flex", flexDirection: "column" }} />
			  :
			  <div style={{ height: 55 }} />
			}
			<Button key={index} variant="contained" sx={getPlayerSlotStyle(slot)} disabled disableElevation disableTouchRipple>
			  <Avatar src={slot.player.avatar} alt={slot.player.username + " avatar"} sx={{marginTop: "20px", width: 56, height: 56 }} />
			  <p className="username-text"> {getPlayerName(slot)} </p>
			</Button>
			<div style={{display:'flex', flexDirection:'row'}}>

				{!isFriend(slot.player?.id) &&
					<Button onClick={() => {addFriend(slot.player?.username)}}>
						<PersonAddIcon/>
					</Button>
				}
			{
				game.owner == user?.username && slot.player.id != user?.id&&
				<Button onClick={() => {handleKick(slot.player?.id)}}>
				<LogoutIcon/>
			</Button>
			}
			</div>
		  </div>
		);
	  }
	  
	  function renderEmptySlot(slot, index) {
		if (slot.type == LobbySlotType.friend && game.LobbyType != LobbyType.auto && game.LobbyType != LobbyType.classic) {
		  return (
			<div key={index} style={{ display: "flex", flexDirection: "column" }}>
			  	<div style={{ height: 55}} />
			  	<Button variant="contained" sx={{  flexDirection:'column', width:"100px", height:"100px", lineHeight:'1', fontSize:"0.7rem" }}>
					<div style={{height:100}}/>
					<LoopIcon
						sx={{
							marginBottom:'12px',
							animation: "spin 2s linear infinite",
							"@keyframes spin": {
								"0%": {
									transform: "rotate(360deg)",
								},
								"100%": {
									transform: "rotate(0deg)",
								},
							},
						}}
					/>
					<p style={{marginTop:0, marginBottom:14}}>
						Searching Players...
					</p>
				</Button>
			  <Button sx={{ alignSelf: "center", width: "auto" }} onClick={() => { setOpen(true); setIndexInviteSlot(index) }}>
				Invite
			  </Button>
			  {renderInviteDialog()}
			</div>
		  );

		} else if (slot.type == LobbySlotType.invited && game.LobbyType != LobbyType.auto && game.LobbyType != LobbyType.classic && slot.player) {
		  return (
			<div>
			  <div style={{ height: 55 }} />
			  {renderInvitedSlot(slot, index)}
			</div>
		  );
		} else {
		  return (
			<div key={index}>
			  <div style={{ height: 55 }} />
			  <Button variant="contained" sx={{  flexDirection:'column', width:"100px", height:"100px", lineHeight:'1', fontSize:"0.7rem" }}>
					<div style={{height:100}}/>
					<LoopIcon
						sx={{
							marginBottom:'12px',
							animation: "spin 2s linear infinite",
							"@keyframes spin": {
								"0%": {
									transform: "rotate(360deg)",
								},
								"100%": {
									transform: "rotate(0deg)",
								},
							},
						}}
					/>
					<p style={{marginTop:0, marginBottom:14}}>
						Searching Players...
					</p>
				</Button>
			</div>
		  );
		}
	};
	  
	  function getPlayerSlotStyle(slot) {
		const isOwner = game.owner == slot.player.username && game.LobbyType != LobbyType.auto && game.LobbyType != LobbyType.classic;
		const backgroundColor = isOwner ? "#FFD700" : "#e8e8e8";
		const boxShadow = isOwner ? "0 0px 10px #FFD700" : null;
		const color = "black" 
		return {
		  width: 100,
		  height: 100,
		  flexDirection: "column",
		  "&:disabled": {
			backgroundColor,
			boxShadow,
			color,
		  }
		};
	  }
	  
	  function getPlayerName(slot) {
		return slot.player.username != user?.username ? slot.player?.username : "ME";
	  }
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
	
	  function handleInviteFriendClick(friend: Friendships, key: any) {
		inviteFriend(friend.friend_id == user?.id ? friend.user : friend.friend, key)
		setOpen(false);
	  }

	  function getFriendAvatar(friend: Friendships) {
		return (friend.friend_id == user?.id ? friend.user.avatar : friend.friend.avatar);
	  }

	  function getFriendUsername(friend: Friendships) {
		return (friend.friend_id == user?.id ? friend.user.username : friend.friend.username);
	  }
	  
	  function renderInviteDialog() {
		return (
		  <Dialog open={open} onClose={() => { setOpen(false); setIndexInviteSlot(-1) }}>
			<DialogTitle>Invite friend</DialogTitle>
			<List sx={{ pt: 0 }}>
			  {invitableFriend?.map((friend, key) =>
				<ListItem disableGutters key={key}>
				  <ListItemButton onClick={() => handleInviteFriendClick(friend, key)}>
					<ListItemAvatar>
					  <Avatar src={getFriendAvatar(friend)} />
					</ListItemAvatar>
					<ListItemText primary={getFriendUsername(friend)} />
				  </ListItemButton>
				</ListItem>
			  )}
			</List>
		  </Dialog>
		);
	  }

	  function renderInvitedSlot(slot, index) {
		return (
			<div style={{display:"flex", flexDirection:"column"}}>
			<Button key={index} variant="contained" sx={{ width: 100, height:100}} disabled disableElevation disableTouchRipple>
			  <p> Waiting for : {slot.player && slot.player.username ? slot.player.username : ""}... </p>
			</Button>
			<Button sx={{ }} onClick={() => handleCancelInviteClick(slot)}>
			  Cancel
			</Button>
		  </div>
		);
	  }
	  
	  function handleCancelInviteClick(slot: LobbySlotCli) {
		if (!slot.player)
			return;
		const request = game.sentInvites.find((e) => e.receiver.id == slot.player.id);
		if (!request) {
			if (slot.player) {
				dispatch({
					type: "WEBSOCKET_SEND_DELETE_GAME_INVITATION",
					payload: slot.player.id,
				});
			}
			return;
		}
		//dispatch(deleteSentInvite(request));
		dispatch({
		  type: "WEBSOCKET_SEND_DELETE_GAME_INVITATION",
		  payload: request,
		});
	  }
	  
  
	return (
	<div style={{display:"flex", flexDirection:'row', height:"100%"}}>
		{/*<div style={{height:"100vh"}}/>*/}
	{
		game && game.params &&
		<div style={{width: "100%", height: size.height / 2, position:"relative"}}>
		{user && game.owner == user.username &&
			game.full ?
			<Button onClick={() => {
				dispatch({
					type: "WEBSOCKET_SEND_GAME_START",
				})
			}}>Start Game</Button>
			: game.LobbyType != LobbyType.classic && game.LobbyType != LobbyType.auto &&
			<Button disabled>Start Game</Button>
		}
		<Button color='error' onClick={() => {leaveLobby()}}>Leave</Button>
			<Stack sx={{position:'relative', height:"100%", flexDirection:"row", gap:"30px", justifyContent:'center', alignContent:'center', width: "300px", flexWrap:"wrap"}}>
				{renderSlots}
			</Stack>
		</div>
	}	
	{
		game.LobbyType != LobbyType.auto && game.LobbyType != LobbyType.classic &&
		<div style={{width:"100%", minWidth:"600px", maxWidth:"1000px"}}>
			<CreateMatch/>
		</div>}
	</div>
	)
  }
