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
import { CreateMatchLobby } from './CreateMatchLobby';
import { AutoMatch } from './Automatch';
import { JoinMatch } from './JoinMatch';

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

  //useEffect(() => {
  //  console.log(game.LobbyType);
  //}, [lobbyType])

  return (
    <div style={{position: "relative", width: "100%", height:"100%"}}>
      <div style={{position: "relative", display:"flex", height:"100%", width:"100%", alignItems:'center', justifyContent: "center", flexDirection:"row"}}>
        {
          lobbyType != LobbyType.none &&
            <Button sx={{width:"30%"}} color={'primary'} onClick={() => {dispatch(setLobbyType(LobbyType.none))}}>
              <ArrowCircleLeftIcon />
            </Button>
        }
        <div style={{display: 'flex'}}>
        {
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
          <div className='play-buttons' style={{width:'100%'}}>
          <ButtonGroup size="large" variant="contained">
            <Button className="auto-button" onClick={() => {dispatch(setLobbyType(LobbyType.auto))}}>Auto Match</Button>
            <Button className="create-button" onClick={() => {dispatch(setLobbyType(LobbyType.create))}}>Create game</Button>
            <Button className="join-button" onClick={() => {dispatch(setLobbyType(LobbyType.find))}}>Join Game</Button>
          </ButtonGroup>
        </div>
        :
        game.isPlaying && game.lobbyId ? 
        <div className='current-game-block' style={{width:'100%'}}>
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
      </div>
    </div>
  );
}