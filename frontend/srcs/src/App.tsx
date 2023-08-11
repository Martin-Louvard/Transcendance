import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import {
  Routes,
  Route,
} from 'react-router-dom';
import Navbar from './components/Navbar/NavBar.tsx'
import Home from './pages/Home/index.tsx';
import About from './pages/About/index.tsx';
import { usePlayerStore } from './components/Game/PlayerStore.ts';
import { useEffect } from 'react';
import { socket } from './socket.ts';
import { useAppSelector } from './hooks.ts';
import { Game } from './components/Game/Game.tsx';
import { ClientPayloads, ServerEvents, ServerPayloads, ClientEvents } from './components/Game/Type.ts';

function App() {
  const player = usePlayerStore();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    socket.on("connect", () => {
      if (user.id) {
        const payloads: ClientPayloads[ClientEvents.AuthState] = {
          id: user.id,
          token: user.access_token,
        }
        socket.emit(ClientEvents.AuthState, payloads);
        socket.on(ServerEvents.AuthState, (data: ServerPayloads[ServerEvents.AuthState]) => {
          player.setIsAuth(true);
          player.setLobbyId(data.lobbyId);
          if (data.hasStarted) {
            player.setIsPlaying(true);
          }
        })
      }
    })
  }, [])

  return (
    <>
    <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
