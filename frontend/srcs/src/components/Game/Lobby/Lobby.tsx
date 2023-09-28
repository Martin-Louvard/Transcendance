import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {ClientEvents, ClientPayloads, LobbyMode, LobbySlotCli, LobbySlotType, LobbyType, PlayerInfo, ServerEvents, ServerPayloads} from '@shared/class'
import {Button, ButtonGroup, Slider, Stack, Card, CardContent, Avatar, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Grid, Typography, IconButton, styled} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useDispatch } from 'react-redux';
import { Friend, Friendships, User } from 'src/Types';
import { WebSocketState, deleteInvitedGame, deleteSentInvite, resetLobbyData, resetParams, setDuel, setLobbies, setLobbySlots, setLobbyState, setLobbyType, setParams } from '../../../redux/websocketSlice';
import toast from 'react-hot-toast';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { createTheme, useTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { CreateMatch, useWindowSize } from './CreateMatch';
import { CreateMatchLobby } from './WaitingLobby';
import { AutoMatch } from './Automatch';
import { JoinMatch } from './JoinMatch';
import "../Lobby.scss";

export const LobbyDisplayScore: React.FC = (props) => {
  const game = useAppSelector((state) => state.websocket);
  console.log(game.lastGame);
  console.log(game.players);
  console.log(game.playersInfo[0]);
  return (
    game.lastGame &&
      <div>
        {
          game.lastGame.winner != 'draw' ?
         <p>{game.lastGame.winner} win the game</p>
         :
         <p>{game.lastGame.winner} Draw</p>
        }
        <p style={{width: "150px"}}> {`${game.lastGame.score.visitor} - ${game.lastGame.score.home} `}</p>
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
    dispatch(setLobbyType(LobbyType.none));
  }

  function handleReturnButton () {

    if (game.LobbyType == LobbyType.find) {
      dispatch({
        type: 'WEBSOCKET_SEND_LISTEN_LOBBIES',
      });
    }
    dispatch(setLobbyType(LobbyType.none))
  }

  useEffect(() => {
  }, [])

  return (
    <div style={{position: "relative", width: "100%", height:"100%"}}>
       <div style={{position: "relative", display:"flex", height:"100%", width:"100%", alignItems:'center', justifyContent: "center", flexDirection:"column"}}>
      {
        lobbyType == LobbyType.none &&
        <div style={{ width: "100%"}} >
          <img className='logo' src="/duel.svg" />
        <h1 className='letsplay'>Let's Play!</h1>
        </div>
        }
        {
          lobbyType != LobbyType.none && !game.isPlaying &&
            <Button color={'primary'} onClick={() => {handleReturnButton()}}>
              <ArrowCircleLeftIcon />
            </Button>
        }
        <div style={{display: 'flex'}}>
        {
          lobbyType == LobbyType.score ?
          <LobbyDisplayScore />
          :
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
         
          <div className='play-buttons light-purple' style={{width:'100%'}}>
            <button className="auto-button" onClick={() => {dispatch(setLobbyType(LobbyType.auto))}}>Auto Match</button>
            <button className="create-button" onClick={() => {dispatch(setLobbyType(LobbyType.create))}}>Create game</button>
            <button className="join-button" onClick={() => {dispatch(setLobbyType(LobbyType.find))}}>Join Game</button>
        </div>
        :
        game.isPlaying && game.lobbyId ? 
        <div className='current-game-block' style={{width:'100%'}}>
          <p>You are currently in a game : </p>
          <button className="join-current-game" onClick={() => {navigate('/game/' + game.lobbyId)}}>Join Game</button>
        </div>
        :
        lobbyType != LobbyType.none && lobbyType != LobbyType.score &&
        <CreateMatchLobby game={game} size={size} leaveLobby={leaveLobby}/>
        }
        </div>
      </div>
    </div>
  );
}
