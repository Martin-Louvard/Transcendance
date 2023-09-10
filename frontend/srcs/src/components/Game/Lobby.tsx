import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { ClientEvents, ClientPayloads, LobbyMode, ServerEvents, ServerPayloads } from './Type';
import { usePlayerStore } from './PlayerStore';
import './Lobby.scss'

const AutoMatch: React.FC = () => {
  const [gameState, setGameState] = useState({isDouble: false, isDuel: false})
  const player = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameState.isDouble) {
      socket.emit("automatch", LobbyMode.double);
    } else if (gameState.isDuel) {
      socket.emit("automatch", LobbyMode.duel);
    }
  }, [gameState])

    return (
      <>
        <img src="/marvin2.png" className="logo" alt="PONGƎD logo" />
        <div className='play-buttons'>
          <button onClick={() => {setGameState({isDuel: true, isDouble: false});}}>Duel</button>
          <button onClick={() => {setGameState({isDuel: false, isDouble: true });}}>Double</button>
        </div>
    {/*}*/}
    </>
    );
}

const CreateMatch: React.FC = () => {

  return (
    null
  );
}

const JoinMatch: React.FC = () => {

  return (
    null
  );
}

export const Lobby: React.FC = () => {
  const [lobbyState, setLobbyState] = useState({isAuto: false, isCreate: false, isJoin: false});
  const player = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on(ServerEvents.LobbyState, (data: ServerPayloads[ServerEvents.LobbyState]) => {
      if (!player.lobbyId)
          player.setLobbyId(data.lobbyId);
          if (data.hasStarted && !player.isPlaying)
            player.setIsPlaying(true);
      if (data.hasStarted) {
        player.setIsPlaying(true);
        navigate('game/' + data.lobbyId);
      }
    }), []
  })

  useEffect(() => {
  }, [player.lobbyId, player.isPlaying])

  function leaveLobby(): void {
    const payloads: ClientPayloads[ClientEvents.LobbyState] = {
      leaveLobby: true,
      mode: null,
      automatch: null,
    }
    socket.emit(ClientEvents.LobbyState, payloads);
  }

  return (
    lobbyState.isAuto && !player.lobbyId ?
      <AutoMatch/>
    :
    lobbyState.isCreate && !player.lobbyId ?
      <CreateMatch/>
    :
    lobbyState.isJoin && !player.lobbyId ?
      <JoinMatch/>
    :
    !player.lobbyId && !player.isPlaying?
    <>
    <img src="/marvin2.png" className="logo" alt="PONGƎD logo" />
    <div className='play-buttons'>
      <button className="auto-button" onClick={() => {setLobbyState({isAuto: true, isCreate: false, isJoin: false})}}>AUTOMATCH</button>
      <button className="create-button" onClick={() => {setLobbyState({isAuto: false, isCreate: true, isJoin: false})}}>CREATE GAME</button>
      <button className="join-button" onClick={() => {setLobbyState({isAuto: false, isCreate: false, isJoin: true})}}>JOIN GAME</button>
    </div>
    </>
    :
    player.isPlaying && player.lobbyId? 
    <div className='current-game-block'>
      <p>You are currently in a game : </p>
      <button className="join-current-game" onClick={() => {navigate('/game/' + player.lobbyId)}}>Join Game</button>
    </div>
      
    :
      <div>
        <p >Waiting for a game...</p>
        <button onClick={leaveLobby}>Stop Searching</button>
      </div>
  );
}