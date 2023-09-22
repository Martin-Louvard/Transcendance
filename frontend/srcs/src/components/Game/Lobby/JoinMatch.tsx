import { Avatar, Button, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography, styled } from "@mui/material";
import { LobbyType } from "@shared/class";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setLobbyType } from "../../../redux/websocketSlice";

const Demo = styled('div')(({ theme }) => ({
	backgroundColor: "transparent",
	width:"500px",
	border: "solid",
	borderRadius:10,
  }));
  
  

export const JoinMatch: React.FC = () => {
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
		console.log(game.lobbies);
	  if (!game.lobbies)
		  return ;
	  setRenderLobbies(game.lobbies.map((lobby, key) => (
		<ListItem key={key}
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
	const [dense, setDense] = useState(false);
	const [secondary, setSecondary] = useState(false);
	return (
	  <div>
		<Grid item xs={12} md={6}  sx={{width:"50%", m:"auto"}}>
			<Typography sx={{ mt: 4, mb: 2}} variant="h6" component="div">
			  Avalaible Lobbies
			</Typography>
			<Demo>
				{renderLobbies}
			</Demo>
		</Grid>
	  </div>
	);
  }
  