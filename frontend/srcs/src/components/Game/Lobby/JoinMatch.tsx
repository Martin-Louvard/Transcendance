import { Avatar, Button, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography, styled } from "@mui/material";
import { LobbySlotCli, LobbyType } from "@shared/class";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setLobbyType } from "../../../redux/websocketSlice";

const Demo = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
  }));
  
  

export const JoinMatch: React.FC = () => {
	const game = useAppSelector((state) => state.websocket);
	const dispatch = useAppDispatch();
	const [renderLobbies, setRenderLobbies] = useState<Element[] | null>(null);
	const user = useAppSelector((state) => state.session.user);
  
	useEffect(() => {
		  dispatch({
			  type: 'WEBSOCKET_SEND_LISTEN_LOBBIES',
		  });
	}, [])
  
	function joinLobby(id: string) {
	  dispatch(setLobbyType(LobbyType.create));
	  dispatch({
		type: "WEBSOCKET_SEND_JOIN_LOBBY",
		payload: {lobbyId: id, info: {username: user?.username, avatar: user?.avatar, id: user?.id}},
	  })
  
	}

	function getRemainingSlot(slots: LobbySlotCli[]) {
		let nb = 0;
		slots.forEach((e) => {
			if (e.full)
				nb++;
		})
		return (nb);
	}
  
	useEffect(() => {
	  if (!game.lobbies)
		  return ;
	  setRenderLobbies(game.lobbies.map((lobby, key) => (
		<div key={key} style={{width:"500px", backgroundColor:"transparent", borderColor:"white", border:"3px solid", borderRadius:"15px"}}>
			<ListItem
			secondaryAction={
				<Button onClick={() => {joinLobby(lobby.id)}}>JOIN</Button>
			}
			>
			<ListItemAvatar>
				<Avatar src={lobby.creator.avatar}/>
			</ListItemAvatar>
			<ListItemText sx={{color:'white'}}
				primary={`${lobby.creator.username}'s lobby`}
				secondary={`${getRemainingSlot(lobby.slots)} / ${lobby.size}`}
				secondaryTypographyProps={{color:"white"}}
				/>
			</ListItem>
		</div>
	  )))
  
	}, [game.lobbies])
	return (
	  <div style={{width:"100%"}}>
		<div item={+true} xs={12} md={6} >
			<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
			  Avalaible Lobbies
			</Typography>
			{renderLobbies}
		</div>
	  </div>
	);
  }
  