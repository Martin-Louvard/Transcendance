import { Button, ButtonGroup } from "@mui/material";
import { LobbyMode, LobbyType } from "@shared/class";
import { useEffect, useState } from "react";
import { User } from "src/Types";
import { useAppDispatch } from "../../../redux/hooks";
import { WebSocketState, setDuel, setLobbyType } from "../../../redux/websocketSlice";

export const AutoMatch: React.FC = (props) => {
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
  