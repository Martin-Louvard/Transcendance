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

	function findClassicGame() {
		if (!user)
			return ;
		dispatch(setLobbyType(LobbyType.classic));
		dispatch({
			type: 'WEBSOCKET_SEND_CLASSICAUTOMATCH',
			payload: {info:{username: user.username, avatar: user.avatar, id: user.id}}
		})
	}
  
	  return (
		  <div  style={{width:'100%'}}>
          <div className='play-buttons light-purple' style={{width:'100%'}}>
				<button onClick={() => {findClassicGame()}}>Classic</button>
				<button onClick={() => {setGameState({isDuel: true, isDouble: false});}}>Duel</button>
				<button onClick={() => {setGameState({isDuel: false, isDouble: true });}}>Double</button>
			</div>
			<h2 className="choosemode">Choose Mode</h2>
		  </div>
	  );
  }
  